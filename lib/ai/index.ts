'use client';

import { analyzeEmotion } from './emotion';
import { extractTheme } from './theme';
import { generateReflectionQuestion } from './questions';
import { analyzeFallback, isTextValid } from './fallback-analysis';
import type { AnalysisCallbacks, InsightBundle } from './types';
import type { Locale } from '@/lib/i18n/messages';
import { t } from '@/lib/i18n/translate';
import { isMostlyCjk } from '@/lib/language';

export interface AnalyzeJournalOptions extends AnalysisCallbacks {
  locale?: Locale;
}

export async function analyzeJournal(
  text: string,
  options?: AnalyzeJournalOptions
): Promise<InsightBundle> {
  const uiLocale: Locale = options?.locale ?? 'en';
  if (text.trim().length === 0) {
    throw new Error(t(uiLocale, 'analysis.error.empty'));
  }

  if (!isTextValid(text)) {
    throw new Error(t(uiLocale, 'analysis.error.tooShort'));
  }

  const language: Locale = isMostlyCjk(text) ? 'zh' : 'en';

  // The bundled AI models are English-first. For CJK text, use language-aware fallback.
  if (language !== 'en') {
    options?.onModelStatus?.('ready');
    options?.onDownloadProgress?.(100);

    const result = analyzeFallback(text, { locale: uiLocale, language });
    result.theme.text = `${result.theme.text}\n\n${t(uiLocale, 'analysis.notice.simplified.language')}`;
    return result;
  }

  try {
    // Try AI-powered analysis first
    const emotion = await analyzeEmotion(text, options);
    const theme = await extractTheme(text, options);
    const reflection = generateReflectionQuestion(emotion, theme.rawSummary);

    options?.onModelStatus?.('ready');
    options?.onDownloadProgress?.(100);

    return { emotion, theme, reflection };
  } catch (error) {
    console.warn(
      '[Journal Analysis] AI models failed, using fallback analysis:',
      error
    );

    console.log('[Journal Analysis] Using rule-based analysis fallback');
    options?.onModelStatus?.('ready');
    options?.onDownloadProgress?.(100);

    const result = analyzeFallback(text, { locale: uiLocale, language });
    result.theme.text = `${result.theme.text}\n\n${t(uiLocale, 'analysis.notice.simplified.modelsFailed')}`;
    return result;
  }
}
