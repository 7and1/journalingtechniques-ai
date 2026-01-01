'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { PromptSelector } from './PromptSelector';
import { FirstTimeSetup } from './FirstTimeSetup';
import { ErrorNotice } from './ErrorNotice';
import { InsightCards } from './InsightCards';
import { FeedbackButtons } from './FeedbackButtons';
import { JournalHistory } from './JournalHistory';
import {
  DEFAULT_PROMPT_ID,
  buildPrefill,
  isPromptTemplateId,
  type PromptTemplateId,
} from '@/lib/guided-prompts';
import { countWords } from '@/lib/utils';
import { MIN_WORD_COUNT } from '@/lib/constants';
import { analyzeJournal } from '@/lib/ai';
import type { InsightBundle } from '@/lib/ai/types';
import { trackEvent } from '@/lib/analytics';
import { getClientLocale } from '@/lib/i18n/client';
import { t } from '@/lib/i18n/translate';
import { getVaultStatus } from '@/lib/vault';
import {
  loadDraft,
  saveDraft,
  loadHistory,
  saveHistory,
  addHistoryEntry,
  updateHistoryEntry,
  deleteHistoryEntry,
  clearHistory,
  type StoredEntry,
} from '@/lib/journal-storage';

const INITIAL_PROMPT = DEFAULT_PROMPT_ID;
const AUTOSAVE_DELAY_MS = 2000;

export function JournalExperience() {
  const locale = getClientLocale();
  const [promptId, setPromptId] = useState<PromptTemplateId>(INITIAL_PROMPT);
  const [entry, setEntry] = useState(() =>
    buildPrefill(INITIAL_PROMPT, locale)
  );
  const [insights, setInsights] = useState<InsightBundle | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [modelProgress, setModelProgress] = useState(0);
  const [modelStatus, setModelStatus] = useState<
    'idle' | 'downloading' | 'ready'
  >('idle');
  const [feedbackState, setFeedbackState] = useState<
    'positive' | 'negative' | null
  >(null);
  const [analysisDuration, setAnalysisDuration] = useState(0);
  const [hasStartedWriting, setHasStartedWriting] = useState(false);
  const [history, setHistory] = useState<StoredEntry[]>([]);
  const [activeHistoryEntryId, setActiveHistoryEntryId] = useState<
    string | null
  >(null);
  const [notice, setNotice] = useState<{
    kind: 'success' | 'error';
    message: string;
  } | null>(null);
  const hasTrackedDownload = useRef(false);
  const downloadStart = useRef<number | null>(null);
  const autosaveTimer = useRef<NodeJS.Timeout | null>(null);

  const wordCount = useMemo(() => countWords(entry), [entry]);
  const canAnalyze = wordCount >= MIN_WORD_COUNT && !isAnalyzing;
  const canSave = wordCount > 0 && !isAnalyzing;
  const promptPrefillRef = useRef(promptId);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      // URL param prefill always wins.
      const params = new URLSearchParams(window.location.search);
      const templateParam = params.get('template');
      const templateId = isPromptTemplateId(templateParam)
        ? templateParam
        : null;
      const prefillText = params.get('prefill') ?? params.get('prompt');

      if (prefillText || templateId) {
        if (templateId) {
          if (!cancelled) setPromptId(templateId);
          promptPrefillRef.current = templateId;
        }

        if (prefillText) {
          if (!cancelled) setEntry(prefillText);
        } else if (templateId) {
          if (!cancelled) setEntry(buildPrefill(templateId, locale));
        }
      } else {
        const draft = await loadDraft();
        if (draft && !cancelled) {
          setPromptId(draft.promptId);
          promptPrefillRef.current = draft.promptId;
          setEntry(draft.entry);
        }
      }

      const loadedHistory = await loadHistory();
      if (!cancelled) setHistory(loadedHistory);
    };

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    const handler = () => {
      const { enabled, unlocked } = getVaultStatus();
      if (enabled && !unlocked) {
        setHistory([]);
        setInsights(null);
        setFeedbackState(null);
        setAnalysisError(
          locale === 'zh'
            ? '已启用密码保护，请解锁后继续。'
            : 'Vault is enabled. Unlock to continue.'
        );
        setNotice(null);
        return;
      }
      void loadHistory().then((loaded) => setHistory(loaded));
    };

    window.addEventListener('jt_vault_change', handler);
    return () => window.removeEventListener('jt_vault_change', handler);
  }, [locale]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasStartedWriting && wordCount > 0 && wordCount < MIN_WORD_COUNT) {
        trackEvent('writing_abandoned', {
          prompt_type: promptId,
          word_count: wordCount,
        });
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasStartedWriting, wordCount, promptId]);

  useEffect(() => {
    if (modelStatus === 'downloading' && !hasTrackedDownload.current) {
      downloadStart.current = performance.now();
      trackEvent('model_download_started', { prompt_type: promptId });
    }
    if (
      modelStatus === 'ready' &&
      modelProgress === 100 &&
      !hasTrackedDownload.current &&
      downloadStart.current !== null
    ) {
      trackEvent('model_download_completed', {
        prompt_type: promptId,
        download_duration_ms: downloadStart.current
          ? Math.round(performance.now() - downloadStart.current)
          : undefined,
      });
      hasTrackedDownload.current = true;
    }
  }, [modelStatus, modelProgress, promptId]);

  const handlePromptChange = (id: PromptTemplateId) => {
    setPromptId(id);
    setEntry(buildPrefill(id, locale));
    setInsights(null);
    setFeedbackState(null);
    setNotice(null);
    setActiveHistoryEntryId(null);
    promptPrefillRef.current = id;
  };

  const handleTextChange = (value: string) => {
    setEntry(value);
    setNotice(null);
    if (!hasStartedWriting && value.trim().length > 0) {
      setHasStartedWriting(true);
      trackEvent('writing_started', {
        prompt_type: promptId,
        time_since_page_load_ms: performance.now(),
      });
    }

    // Autosave draft
    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current);
    }
    autosaveTimer.current = setTimeout(() => {
      if (value.trim().length > 0) {
        void saveDraft({
          promptId,
          entry: value,
          updatedAt: new Date().toISOString(),
        }).catch(() => {});
      }
    }, AUTOSAVE_DELAY_MS);
  };

  const runAnalysis = async (params?: {
    entryId?: string;
    text?: string;
    prompt?: PromptTemplateId;
  }) => {
    const targetText = params?.text ?? entry;
    const targetPrompt = params?.prompt ?? promptId;
    const targetWordCount = countWords(targetText);
    if (targetWordCount < MIN_WORD_COUNT || isAnalyzing) return;

    const start = performance.now();
    setIsAnalyzing(true);
    setAnalysisError(null);
    setModelStatus('idle');
    setModelProgress(0);
    trackEvent('insight_requested', {
      prompt_type: targetPrompt,
      word_count: targetWordCount,
      character_count: targetText.length,
      is_first_time: !window.localStorage.getItem('jt_has_analyzed'),
    });

    try {
      const result = await analyzeJournal(targetText, {
        locale,
        onModelStatus: (status) => setModelStatus(status),
        onDownloadProgress: (progress) => setModelProgress(progress),
      });
      const duration = performance.now() - start;
      setAnalysisDuration(duration);
      setInsights(result);
      setFeedbackState(null);

      const analyzedAt = new Date().toISOString();
      const entryId = params?.entryId ?? activeHistoryEntryId;
      if (entryId) {
        const updatedHistory = await updateHistoryEntry(entryId, (current) => ({
          ...current,
          promptId: targetPrompt,
          entry: targetText,
          wordCount: targetWordCount,
          insights: result,
          analyzedAt,
        }));
        setHistory(updatedHistory);
        setActiveHistoryEntryId(entryId);
      } else {
        const historyEntry: StoredEntry = {
          id: `entry_${Date.now()}`,
          promptId: targetPrompt,
          entry: targetText,
          wordCount: targetWordCount,
          createdAt: analyzedAt,
          insights: result,
          analyzedAt,
        };
        const updatedHistory = await addHistoryEntry(historyEntry);
        setHistory(updatedHistory);
        setActiveHistoryEntryId(historyEntry.id);
      }

      // Clear draft after successful analysis
      try {
        await saveDraft(null);
      } catch (error) {
        if (error instanceof Error && error.message === 'vault_locked') {
          setAnalysisError(
            locale === 'zh'
              ? '已启用密码保护，请解锁后再保存/分析。'
              : 'Vault is locked. Unlock to save/analyze.'
          );
        }
      }

      trackEvent('insight_completed', {
        prompt_type: targetPrompt,
        analysis_duration_ms: Math.round(duration),
        word_count: targetWordCount,
        emotion_detected: result.emotion.rawLabel.toLowerCase() as
          | 'positive'
          | 'negative',
        confidence_score: result.emotion.confidence,
      });
      window.localStorage.setItem('jt_has_analyzed', 'true');
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : locale === 'zh'
            ? '暂时无法分析，请稍后再试。'
            : 'Unable to analyze right now. Please try again soon.';
      setAnalysisError(message);
      trackEvent('error_occurred', {
        prompt_type: targetPrompt,
        error_type: 'analysis_failed',
        word_count: targetWordCount,
      });
    } finally {
      setIsAnalyzing(false);
      setModelStatus('ready');
      setModelProgress(100);
    }
  };

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    await runAnalysis();
  };

  const handleSaveEntry = async () => {
    if (!canSave) return;

    const now = new Date().toISOString();
    try {
      if (activeHistoryEntryId) {
        const current = history.find(
          (item) => item.id === activeHistoryEntryId
        );
        if (current) {
          const isUnchanged =
            current.entry === entry &&
            current.promptId === promptId &&
            current.wordCount === wordCount;
          if (isUnchanged) return;

          if (current.insights) {
            const confirmed = window.confirm(
              t(locale, 'journal.confirmUpdateClearsInsights')
            );
            if (!confirmed) return;
          }
        }

        const updatedHistory = await updateHistoryEntry(
          activeHistoryEntryId,
          (current) => ({
            ...current,
            promptId,
            entry,
            wordCount,
            insights: null,
            analyzedAt: null,
          })
        );
        setHistory(updatedHistory);
        setInsights(null);
        setFeedbackState(null);
        trackEvent('history_entry_saved', {
          prompt_type: promptId,
          word_count: wordCount,
          mode: 'update',
        });
        return;
      }

      const historyEntry: StoredEntry = {
        id: `entry_${Date.now()}`,
        promptId,
        entry,
        wordCount,
        createdAt: now,
        insights: null,
        analyzedAt: null,
      };
      const updatedHistory = await addHistoryEntry(historyEntry);
      setHistory(updatedHistory);
      setActiveHistoryEntryId(historyEntry.id);
      setInsights(null);
      setFeedbackState(null);
      trackEvent('history_entry_saved', {
        prompt_type: promptId,
        word_count: wordCount,
        mode: 'new',
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'vault_locked') {
        setAnalysisError(
          locale === 'zh'
            ? '已启用密码保护，请解锁后再保存。'
            : 'Vault is locked. Unlock to save.'
        );
        return;
      }
      console.error(error);
      setAnalysisError(
        locale === 'zh'
          ? '保存失败，请重试。'
          : 'Failed to save. Please try again.'
      );
    }
  };

  const handleNewEntry = () => {
    setEntry(buildPrefill(promptId, locale));
    setInsights(null);
    setFeedbackState(null);
    setAnalysisError(null);
    setNotice(null);
    setActiveHistoryEntryId(null);
    trackEvent('new_entry_started', { prompt_type: promptId });
  };

  const handleLoadEntry = (storedEntry: StoredEntry) => {
    setPromptId(storedEntry.promptId);
    setEntry(storedEntry.entry);
    setInsights(storedEntry.insights ?? null);
    setFeedbackState(null);
    setNotice(null);
    setActiveHistoryEntryId(storedEntry.id);
    promptPrefillRef.current = storedEntry.promptId;
    trackEvent('history_entry_loaded', {
      prompt_type: storedEntry.promptId,
      word_count: storedEntry.wordCount,
    });
  };

  const handleAnalyzeEntry = async (storedEntry: StoredEntry) => {
    setPromptId(storedEntry.promptId);
    setEntry(storedEntry.entry);
    setInsights(null);
    setFeedbackState(null);
    setNotice(null);
    setActiveHistoryEntryId(storedEntry.id);
    promptPrefillRef.current = storedEntry.promptId;
    await runAnalysis({
      entryId: storedEntry.id,
      text: storedEntry.entry,
      prompt: storedEntry.promptId,
    });
  };

  const handleDeleteEntry = async (storedEntry: StoredEntry) => {
    if (window.confirm(t(locale, 'journal.confirmDeleteEntry'))) {
      const updated = await deleteHistoryEntry(storedEntry.id);
      setHistory(updated);
      if (activeHistoryEntryId === storedEntry.id) {
        setActiveHistoryEntryId(null);
        setInsights(null);
        setFeedbackState(null);
        setEntry(buildPrefill(promptPrefillRef.current, locale));
      }
      trackEvent('history_entry_deleted', {
        prompt_type: storedEntry.promptId,
      });
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm(t(locale, 'journal.confirmClearHistory'))) {
      await clearHistory();
      setHistory([]);
      setNotice(null);
      trackEvent('history_cleared');
    }
  };

  const handleImportFile = async (file: File) => {
    setNotice(null);
    setAnalysisError(null);

    try {
      const text = await file.text();
      const imported = parseImportedEntries(text, file.name);
      if (imported.length === 0) {
        setNotice({
          kind: 'error',
          message:
            locale === 'zh'
              ? '未识别到可导入的记录。'
              : 'No importable entries found.',
        });
        return;
      }

      const current = await loadHistory();
      const merged = mergeHistory(imported, current, 100);
      await saveHistory(merged);
      setHistory(merged);

      setNotice({
        kind: 'success',
        message:
          locale === 'zh'
            ? `已导入 ${imported.length} 条记录。`
            : `Imported ${imported.length} entries.`,
      });
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error && error.message === 'vault_locked'
          ? locale === 'zh'
            ? '已启用密码保护，请解锁后再导入。'
            : 'Vault is locked. Unlock to import.'
          : locale === 'zh'
            ? '导入失败，请检查文件格式。'
            : 'Import failed. Please check the file format.';
      setNotice({ kind: 'error', message });
    }
  };

  return (
    <section className="space-y-6">
      <JournalHistory
        entries={history}
        onLoad={handleLoadEntry}
        onAnalyze={handleAnalyzeEntry}
        onDelete={handleDeleteEntry}
        onImport={handleImportFile}
        onClear={handleClearHistory}
      />
      <PromptSelector value={promptId} onChange={handlePromptChange} />
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/60">
        {notice ? (
          <div
            className={`mb-5 rounded-2xl border p-4 text-sm ${
              notice.kind === 'success'
                ? 'border-emerald-200 bg-emerald-50/70 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100'
                : 'border-rose-200 bg-rose-50/70 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-100'
            }`}
            role="status"
            aria-live="polite"
          >
            {notice.message}
          </div>
        ) : null}
        <label
          htmlFor="journal-entry"
          className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500"
        >
          {t(locale, 'journal.label')}
        </label>
        <textarea
          id="journal-entry"
          value={entry}
          onChange={(event) => handleTextChange(event.target.value)}
          className="mt-4 h-[320px] w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-base leading-relaxed text-slate-900 shadow-inner focus:border-brand focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500"
          placeholder={t(locale, 'journal.placeholder')}
        />
        <div className="mt-3 flex flex-wrap items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <p>
            {t(locale, 'journal.wordMinimum', {
              count: wordCount,
              min: MIN_WORD_COUNT,
            })}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleNewEntry}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
            >
              {t(locale, 'journal.new')}
            </button>
            <button
              type="button"
              onClick={handleSaveEntry}
              disabled={!canSave}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
            >
              {t(locale, 'journal.save')}
            </button>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 font-semibold text-white shadow-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAnalyzing
                ? t(locale, 'journal.analyzing')
                : t(locale, 'journal.getInsights')}
            </button>
          </div>
        </div>
        {modelStatus === 'downloading' && (
          <FirstTimeSetup progress={modelProgress} />
        )}
        {analysisError && (
          <div className="mt-4">
            <ErrorNotice message={analysisError} onRetry={handleAnalyze} />
          </div>
        )}
        {insights && <InsightCards data={insights} />}
        {insights && (
          <FeedbackButtons
            promptType={promptId}
            emotionLabel={
              insights.emotion.rawLabel.toLowerCase() as 'positive' | 'negative'
            }
            disabled={Boolean(feedbackState)}
            onAnswer={setFeedbackState}
            wordCount={wordCount}
            analysisDuration={Math.round(analysisDuration)}
          />
        )}
      </div>
    </section>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function coerceInsightBundle(value: unknown): InsightBundle | null {
  if (!isRecord(value)) return null;
  const emotion = value.emotion;
  const theme = value.theme;
  const reflection = value.reflection;
  if (!isRecord(emotion) || !isRecord(theme) || !isRecord(reflection))
    return null;

  if (typeof emotion.emoji !== 'string' || typeof emotion.tone !== 'string')
    return null;
  if (typeof theme.text !== 'string') return null;
  if (typeof reflection.question !== 'string') return null;

  return value as unknown as InsightBundle;
}

function parseImportedEntries(text: string, filename: string): StoredEntry[] {
  const trimmed = text.trim();
  const looksJson =
    filename.toLowerCase().endsWith('.json') ||
    trimmed.startsWith('[') ||
    trimmed.startsWith('{');
  if (looksJson) {
    return parseJsonEntries(trimmed);
  }
  return parseMarkdownEntries(text);
}

function parseJsonEntries(text: string): StoredEntry[] {
  const parsed: unknown = JSON.parse(text);
  const list: unknown[] = Array.isArray(parsed)
    ? parsed
    : isRecord(parsed) && Array.isArray(parsed.history)
      ? (parsed.history as unknown[])
      : [];
  const now = new Date().toISOString();

  return list
    .map((item, index) => {
      const record = isRecord(item) ? item : null;
      const entryText = typeof record?.entry === 'string' ? record.entry : '';
      if (!entryText.trim()) return null;
      const createdAt =
        typeof record?.createdAt === 'string' ? record.createdAt : now;
      const wordCount =
        typeof record?.wordCount === 'number'
          ? record.wordCount
          : countWords(entryText);
      const promptId = isPromptTemplateId(record?.promptId)
        ? (record?.promptId as PromptTemplateId)
        : DEFAULT_PROMPT_ID;
      const insights = coerceInsightBundle(record?.insights);
      const analyzedAt =
        typeof record?.analyzedAt === 'string' ? record.analyzedAt : createdAt;

      const imported: StoredEntry = {
        id: `import_${Date.now()}_${index}`,
        promptId,
        entry: entryText,
        wordCount,
        createdAt,
        insights: insights ?? null,
        analyzedAt: insights ? analyzedAt : null,
      };
      return imported;
    })
    .filter((value): value is StoredEntry => Boolean(value));
}

function parseMarkdownEntries(text: string): StoredEntry[] {
  const chunks = text.split('\n## Entry ');
  if (chunks.length <= 1) return [];

  const now = new Date().toISOString();
  const results: StoredEntry[] = [];

  for (let index = 1; index < chunks.length; index += 1) {
    const chunk = chunks[index];

    const isoMatch = chunk.match(/\*\*Created At \(ISO\):\*\*\s*(.+)/);
    const createdAt = isoMatch?.[1]?.trim() || now;

    const promptMatch = chunk.match(/\*\*Prompt:\*\*\s*(.+)/);
    const promptRaw = promptMatch?.[1]?.trim();
    const promptId = isPromptTemplateId(promptRaw)
      ? promptRaw
      : DEFAULT_PROMPT_ID;

    const wcMatch = chunk.match(/\*\*Word Count:\*\*\s*(\d+)/);
    const wc = wcMatch ? Number.parseInt(wcMatch[1], 10) : undefined;

    const contentStart = chunk.indexOf('### Content');
    if (contentStart === -1) continue;
    const after = chunk.slice(contentStart);
    const start = after.indexOf('\n');
    if (start === -1) continue;
    const rest = after.slice(start + 1);

    const aiIndex = rest.indexOf('### AI Insights');
    const dividerIndex = rest.indexOf('\n---');
    const endIndexCandidates = [aiIndex, dividerIndex].filter((n) => n !== -1);
    const endIndex = endIndexCandidates.length
      ? Math.min(...endIndexCandidates)
      : rest.length;

    const entryText = rest.slice(0, endIndex).trim();
    if (!entryText) continue;

    const imported: StoredEntry = {
      id: `import_${Date.now()}_${index}`,
      promptId,
      entry: entryText,
      wordCount: Number.isFinite(wc) ? (wc as number) : countWords(entryText),
      createdAt,
      insights: null,
      analyzedAt: null,
    };

    results.push(imported);
  }

  return results;
}

function mergeHistory(
  incoming: StoredEntry[],
  current: StoredEntry[],
  limit: number
) {
  const merged = [...incoming, ...current].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return merged.slice(0, limit);
}
