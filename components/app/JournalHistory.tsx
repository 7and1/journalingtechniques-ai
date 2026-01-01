'use client';

import { useRef, useState } from 'react';
import type { StoredEntry } from '@/lib/journal-storage';
import { exportHistory } from '@/lib/journal-storage';
import { getClientLocale } from '@/lib/i18n/client';
import { t } from '@/lib/i18n/translate';

interface JournalHistoryProps {
  entries: StoredEntry[];
  onLoad: (entry: StoredEntry) => void;
  onAnalyze: (entry: StoredEntry) => void;
  onDelete: (entry: StoredEntry) => void;
  onImport: (file: File) => void | Promise<void>;
  onClear: () => void;
}

export function JournalHistory({
  entries,
  onLoad,
  onAnalyze,
  onDelete,
  onImport,
  onClear,
}: JournalHistoryProps) {
  const locale = getClientLocale();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState<'all' | 'positive' | 'negative'>(
    'all'
  );
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarMonth, setCalendarMonth] = useState(() =>
    startOfMonth(new Date())
  );
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const { dayKeys, countsByDay, currentStreak, maxStreak, maxActivity } =
    buildActivitySummary(entries, 30);
  const entriesByDay = buildEntriesByDay(entries);
  const totalWords = entries.reduce(
    (sum, entry) => sum + (entry.wordCount ?? 0),
    0
  );
  const avgWords =
    entries.length === 0 ? 0 : Math.round(totalWords / entries.length);

  // Filter entries by search query and mood
  const filteredEntries = entries.filter((entry) => {
    // Mood filter
    if (filterMood !== 'all') {
      if (!entry.insights) return false;
      const isPositive = entry.insights.emotion.rawLabel === 'POSITIVE';
      if (filterMood === 'positive' && !isPositive) return false;
      if (filterMood === 'negative' && isPositive) return false;
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchEntry = entry.entry.toLowerCase().includes(query);
      const matchTheme =
        entry.insights?.theme.text.toLowerCase().includes(query) ?? false;
      const matchEmotion =
        entry.insights?.emotion.tone.toLowerCase().includes(query) ?? false;
      const matchReflection =
        entry.insights?.reflection.question.toLowerCase().includes(query) ??
        false;
      return matchEntry || matchTheme || matchEmotion || matchReflection;
    }

    return true;
  });

  const total = entries.length;
  const filteredTotal = filteredEntries.length;
  const analyzedEntries = entries.filter((entry) => Boolean(entry.insights));
  const analyzedTotal = analyzedEntries.length;
  const positiveCount = analyzedEntries.filter(
    (entry) => entry.insights?.emotion.rawLabel === 'POSITIVE'
  ).length;
  const negativeCount = analyzedTotal - positiveCount;
  const positivePercent =
    analyzedTotal === 0 ? 0 : Math.round((positiveCount / analyzedTotal) * 100);
  const analyzedPlural = analyzedTotal === 1 ? 'y' : 'ies';
  const streakPlural = currentStreak === 1 ? '' : 's';

  const handleExport = (format: 'json' | 'markdown') => {
    void exportHistory(format);
    setShowExportMenu(false);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            {t(locale, 'history.kicker')}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">
            {t(locale, 'history.title')}
            {filteredTotal !== total && (
              <span className="ml-2 text-base font-normal text-slate-500">
                ({filteredTotal} {t(locale, 'common.of')} {total})
              </span>
            )}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {analyzedTotal === 0
              ? t(locale, 'history.subtitle.empty')
              : t(locale, 'history.subtitle.stats', {
                  count: analyzedTotal,
                  plural: analyzedPlural,
                })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/60 p-1 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`rounded-full px-3 py-2 transition ${viewMode === 'list' ? 'bg-brand text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-900'}`}
            >
              {t(locale, 'history.view.list')}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`rounded-full px-3 py-2 transition ${viewMode === 'calendar' ? 'bg-brand text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-900'}`}
            >
              {t(locale, 'history.view.calendar')}
            </button>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
            >
              {t(locale, 'history.export')}
            </button>
            {showExportMenu && (
              <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft dark:border-slate-800 dark:bg-slate-950">
                <button
                  type="button"
                  onClick={() => handleExport('markdown')}
                  className="w-full rounded-xl px-4 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  {t(locale, 'history.export.markdown')}
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('json')}
                  className="w-full rounded-xl px-4 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  {t(locale, 'history.export.json')}
                </button>
              </div>
            )}
          </div>
          <input
            ref={importInputRef}
            type="file"
            accept=".json,.md,.markdown,application/json,text/markdown,text/plain"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              void Promise.resolve(onImport(file)).finally(() => {
                if (importInputRef.current) importInputRef.current.value = '';
              });
            }}
          />
          <button
            type="button"
            onClick={() => importInputRef.current?.click()}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
          >
            {t(locale, 'history.import')}
          </button>
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-semibold text-slate-500 underline-offset-4 hover:text-slate-700 hover:underline dark:text-slate-400 dark:hover:text-slate-200"
          >
            {t(locale, 'history.clear')}
          </button>
        </div>
      </div>

      {/* Search and filter */}
      <div className="mt-6 space-y-3">
        <input
          type="text"
          placeholder={t(locale, 'history.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-full border border-slate-300 bg-white px-6 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterMood('all')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filterMood === 'all'
                ? 'bg-brand text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {t(locale, 'history.filter.all')}
          </button>
          <button
            type="button"
            onClick={() => setFilterMood('positive')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filterMood === 'positive'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {t(locale, 'history.filter.positive')}
          </button>
          <button
            type="button"
            onClick={() => setFilterMood('negative')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filterMood === 'negative'
                ? 'bg-rose-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {t(locale, 'history.filter.negative')}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/40">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {t(locale, 'history.moodRatio')}
          </p>
          <p className="mt-2 text-4xl font-semibold text-slate-900 dark:text-slate-50">
            {analyzedTotal === 0 ? '—' : `${positivePercent}%`}{' '}
            {t(locale, 'history.mood.positive')}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t(locale, 'history.basedOnAnalyzed', {
              count: analyzedTotal,
              plural: analyzedPlural,
            })}
          </p>
          <div className="mt-4 space-y-3">
            <MoodBar
              label={t(locale, 'history.mood.positive')}
              value={positiveCount}
              total={analyzedTotal}
              color="bg-emerald-400"
            />
            <MoodBar
              label={t(locale, 'history.mood.negative')}
              value={negativeCount}
              total={analyzedTotal}
              color="bg-rose-400"
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <p className="font-semibold uppercase tracking-[0.3em]">
                {t(locale, 'history.activity')}
              </p>
              <p>
                {t(locale, 'history.activity.streak', {
                  count: currentStreak,
                  plural: streakPlural,
                })}
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="rounded-full bg-white/70 px-3 py-1 dark:bg-slate-950/40">
                {locale === 'zh'
                  ? `最长连续：${maxStreak} 天`
                  : `Longest streak: ${maxStreak} day${maxStreak === 1 ? '' : 's'}`}
              </span>
              <span className="rounded-full bg-white/70 px-3 py-1 dark:bg-slate-950/40">
                {locale === 'zh'
                  ? `总字数：${totalWords}`
                  : `Total words: ${totalWords}`}
              </span>
              <span className="rounded-full bg-white/70 px-3 py-1 dark:bg-slate-950/40">
                {locale === 'zh'
                  ? `平均：${avgWords}`
                  : `Avg words: ${avgWords}`}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-10 gap-1">
              {dayKeys.map((key) => {
                const count = countsByDay.get(key) ?? 0;
                const intensity =
                  maxActivity === 0
                    ? 0
                    : Math.min(3, Math.ceil((count / maxActivity) * 3));
                const cellClass =
                  intensity === 0
                    ? 'bg-slate-200 dark:bg-slate-800'
                    : intensity === 1
                      ? 'bg-brand/20 dark:bg-brand/25'
                      : intensity === 2
                        ? 'bg-brand/50 dark:bg-brand/60'
                        : 'bg-brand/75 dark:bg-brand/90';

                return (
                  <div
                    key={key}
                    title={`${key}: ${count} entr${count === 1 ? 'y' : 'ies'}`}
                    className={`h-3 w-3 rounded-sm ${cellClass}`}
                    aria-label={`${key}: ${count} entr${count === 1 ? 'y' : 'ies'}`}
                  />
                );
              })}
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {t(locale, 'history.activity.last30')}
            </p>
          </div>

          <div className="mt-6 text-sm text-slate-600">
            <p className="font-semibold text-slate-900 dark:text-slate-50">
              {t(locale, 'history.recurringThemes')}
            </p>
            <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
              {analyzedEntries.slice(0, 3).map((entry) => (
                <li key={entry.id} className="truncate">
                  {entry.insights?.theme.text.replace(/\*\*/g, '')}
                </li>
              ))}
              {analyzedEntries.length === 0 ? (
                <li className="text-slate-400">
                  {t(locale, 'history.recurringThemes.empty')}
                </li>
              ) : null}
            </ul>
          </div>
        </article>
        {viewMode === 'calendar' ? (
          <CalendarPanel
            locale={locale}
            month={calendarMonth}
            selectedDay={selectedDay}
            entriesByDay={entriesByDay}
            onPrevMonth={() => setCalendarMonth(addMonths(calendarMonth, -1))}
            onNextMonth={() => setCalendarMonth(addMonths(calendarMonth, 1))}
            onSelectDay={setSelectedDay}
            onLoad={onLoad}
            onAnalyze={onAnalyze}
            onDelete={onDelete}
          />
        ) : (
          <ListPanel
            locale={locale}
            entries={filteredEntries}
            onLoad={onLoad}
            onAnalyze={onAnalyze}
            onDelete={onDelete}
            onClearFilters={() => {
              setSearchQuery('');
              setFilterMood('all');
            }}
          />
        )}
      </div>
    </section>
  );
}

function ListPanel({
  locale,
  entries,
  onLoad,
  onAnalyze,
  onDelete,
  onClearFilters,
}: {
  locale: 'en' | 'zh';
  entries: StoredEntry[];
  onLoad: (entry: StoredEntry) => void;
  onAnalyze: (entry: StoredEntry) => void;
  onDelete: (entry: StoredEntry) => void;
  onClearFilters: () => void;
}) {
  return (
    <div className="space-y-4">
      {entries.length > 0 ? (
        entries.map((entry) => (
          <article
            key={entry.id}
            className="rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden="true">
                  {entry.insights?.emotion.emoji ?? '📝'}
                </span>
                <div>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
                    {entry.insights?.emotion.tone ??
                      t(locale, 'history.entry.savedNotAnalyzed')}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(entry.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onLoad(entry)}
                  className="rounded-full border border-slate-300 px-4 py-1 text-xs font-semibold text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand"
                >
                  {t(locale, 'history.entry.load')}
                </button>
                {!entry.insights ? (
                  <button
                    type="button"
                    onClick={() => onAnalyze(entry)}
                    className="rounded-full bg-brand px-4 py-1 text-xs font-semibold text-white transition hover:bg-brand-dark"
                  >
                    {t(locale, 'history.entry.analyze')}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => onDelete(entry)}
                  className="rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200"
                  aria-label={t(locale, 'history.entry.delete')}
                >
                  {t(locale, 'history.entry.delete')}
                </button>
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              {entry.insights?.theme.text ??
                t(locale, 'history.entry.noInsights')}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
              {t(locale, 'history.entry.words', { count: entry.wordCount })} •{' '}
              {entry.insights?.reflection.technique ?? entry.promptId}
            </p>
          </article>
        ))
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-950/40">
          <p className="font-semibold text-slate-700 dark:text-slate-200">
            {t(locale, 'history.empty.title')}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t(locale, 'history.empty.subtitle')}
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            {t(locale, 'history.empty.clearFilters')}
          </button>
        </div>
      )}
    </div>
  );
}

function CalendarPanel({
  locale,
  month,
  selectedDay,
  entriesByDay,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
  onLoad,
  onAnalyze,
  onDelete,
}: {
  locale: 'en' | 'zh';
  month: Date;
  selectedDay: string | null;
  entriesByDay: Map<string, StoredEntry[]>;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (key: string) => void;
  onLoad: (entry: StoredEntry) => void;
  onAnalyze: (entry: StoredEntry) => void;
  onDelete: (entry: StoredEntry) => void;
}) {
  const grid = buildMonthGrid(month);
  const monthLabel = month.toLocaleDateString(
    locale === 'zh' ? 'zh-CN' : undefined,
    {
      year: 'numeric',
      month: 'long',
    }
  );

  const selectedEntries = selectedDay
    ? (entriesByDay.get(selectedDay) ?? [])
    : [];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 dark:border-slate-800 dark:bg-slate-950/40">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onPrevMonth}
            className="rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
          >
            ←
          </button>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            {monthLabel}
          </p>
          <button
            type="button"
            onClick={onNextMonth}
            className="rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
          >
            →
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
          {(locale === 'zh'
            ? ['日', '一', '二', '三', '四', '五', '六']
            : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          ).map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {grid.map((cell) => {
            const key = dayKey(cell.date);
            const count = entriesByDay.get(key)?.length ?? 0;
            const isSelected = selectedDay === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectDay(key)}
                className={[
                  'flex h-12 flex-col items-center justify-center rounded-xl border text-sm transition',
                  cell.inMonth
                    ? 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950'
                    : 'border-transparent bg-slate-50 text-slate-400 dark:bg-slate-950/20',
                  isSelected ? 'ring-2 ring-brand/40' : '',
                  count > 0
                    ? 'font-semibold text-slate-900 dark:text-slate-50'
                    : 'text-slate-500 dark:text-slate-400',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-label={`${key}: ${count}`}
              >
                <span className="leading-none">{cell.date.getDate()}</span>
                {count > 0 ? (
                  <span className="mt-1 text-[10px] text-brand">{count}</span>
                ) : (
                  <span className="mt-1 text-[10px]">&nbsp;</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 dark:border-slate-800 dark:bg-slate-950/40">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          {selectedDay
            ? t(locale, 'history.calendar.daySummary', {
                day: selectedDay,
                count: selectedEntries.length,
              })
            : t(locale, 'history.calendar.selectDay')}
        </p>
        <div className="mt-3 space-y-3">
          {selectedDay && selectedEntries.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t(locale, 'history.calendar.noEntries')}
            </p>
          ) : null}
          {selectedEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/70 p-3 text-sm dark:border-slate-800 dark:bg-slate-950/20"
            >
              <div className="flex items-center gap-2">
                <span aria-hidden="true">
                  {entry.insights?.emotion.emoji ?? '📝'}
                </span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-50">
                    {entry.insights?.emotion.tone ??
                      t(locale, 'history.entry.savedNotAnalyzed')}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(entry.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onLoad(entry)}
                  className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-200"
                >
                  {t(locale, 'history.entry.load')}
                </button>
                {!entry.insights ? (
                  <button
                    type="button"
                    onClick={() => onAnalyze(entry)}
                    className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white transition hover:bg-brand-dark"
                  >
                    {t(locale, 'history.entry.analyze')}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => onDelete(entry)}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200"
                >
                  {t(locale, 'history.entry.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface MoodBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

function MoodBar({ label, value, total, color }: MoodBarProps) {
  const percent = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildActivitySummary(entries: StoredEntry[], days: number) {
  const countsByDay = new Map<string, number>();

  for (const entry of entries) {
    const key = dayKey(new Date(entry.createdAt));
    countsByDay.set(key, (countsByDay.get(key) ?? 0) + 1);
  }

  const today = startOfDay(new Date());
  const dayKeys = Array.from({ length: days }, (_, index) => {
    const cursor = new Date(today);
    cursor.setDate(today.getDate() - (days - 1 - index));
    return dayKey(cursor);
  });

  let currentStreak = 0;
  {
    const cursor = new Date(today);
    while (true) {
      const key = dayKey(cursor);
      if ((countsByDay.get(key) ?? 0) === 0) break;
      currentStreak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  const maxActivity = Math.max(0, ...Array.from(countsByDay.values()));

  const maxStreak = computeMaxStreak(countsByDay);

  return { dayKeys, countsByDay, currentStreak, maxStreak, maxActivity };
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function dayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildEntriesByDay(entries: StoredEntry[]) {
  const map = new Map<string, StoredEntry[]>();
  for (const entry of entries) {
    const key = dayKey(new Date(entry.createdAt));
    const existing = map.get(key) ?? [];
    existing.push(entry);
    map.set(key, existing);
  }
  // Sort newest first within a day.
  for (const [key, list] of map) {
    map.set(
      key,
      [...list].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
  }
  return map;
}

function computeMaxStreak(countsByDay: Map<string, number>) {
  const activeDays = Array.from(countsByDay.entries())
    .filter(([, count]) => count > 0)
    .map(([key]) => key)
    .sort();

  let best = 0;
  let current = 0;
  let prev: Date | null = null;

  for (const key of activeDays) {
    const date = new Date(`${key}T00:00:00`);
    if (prev) {
      const diff = Math.round(
        (date.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000)
      );
      if (diff === 1) current += 1;
      else current = 1;
    } else {
      current = 1;
    }
    best = Math.max(best, current);
    prev = date;
  }

  return best;
}

function startOfMonth(date: Date) {
  const next = new Date(date);
  next.setDate(1);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addMonths(date: Date, delta: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + delta);
  next.setDate(1);
  next.setHours(0, 0, 0, 0);
  return next;
}

function buildMonthGrid(month: Date) {
  const first = startOfMonth(month);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  const cells: Array<{ date: Date; inMonth: boolean }> = [];
  for (let i = 0; i < 42; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push({ date: d, inMonth: d.getMonth() === first.getMonth() });
  }
  return cells;
}
