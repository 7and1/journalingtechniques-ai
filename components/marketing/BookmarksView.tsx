'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  loadBookmarks,
  clearBookmarks,
  getBookmarkStats,
  type BookmarkedPrompt,
} from '@/lib/bookmarks';
import { getPromptById } from '@/lib/prompts';
import { PromptCard } from './PromptCard';
import { getClientLocale } from '@/lib/i18n/client';
import { t } from '@/lib/i18n/translate';

export function BookmarksView() {
  const locale = getClientLocale();
  const [bookmarks, setBookmarks] = useState<BookmarkedPrompt[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    byCategory: Record<string, number>;
  }>({
    total: 0,
    byCategory: {},
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    void refreshBookmarks();
    const handler = () => {
      void refreshBookmarks();
    };
    window.addEventListener('jt_vault_change', handler);
    return () => window.removeEventListener('jt_vault_change', handler);
  }, []);

  const refreshBookmarks = async () => {
    const allBookmarks = await loadBookmarks();
    setBookmarks(allBookmarks);
    setStats(await getBookmarkStats());
  };

  const handleClearAll = () => {
    if (window.confirm(t(locale, 'bookmarks.confirmClearAll'))) {
      void clearBookmarks().then(() => refreshBookmarks());
    }
  };

  // Filter bookmarks by selected category
  const filteredBookmarks =
    selectedCategory === 'all'
      ? bookmarks
      : bookmarks.filter((b) => b.category === selectedCategory);

  // Get prompts for filtered bookmarks
  const bookmarkedPrompts = filteredBookmarks
    .map((b) => getPromptById(b.id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const categories = Object.keys(stats.byCategory).sort();

  if (bookmarks.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center dark:border-slate-800 dark:bg-slate-950/40">
        <div className="mb-4 text-6xl">☆</div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {t(locale, 'bookmarks.empty.title')}
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          {t(locale, 'bookmarks.empty.subtitle')}
        </p>
        <Link
          href="/prompts"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-soft transition hover:bg-brand-dark"
        >
          {t(locale, 'bookmarks.empty.browseButton')}
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Stats and filters */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {stats.total}{' '}
            {t(
              locale,
              stats.total === 1
                ? 'bookmarks.stats.singular'
                : 'bookmarks.stats.plural'
            )}
          </p>
          {filteredBookmarks.length !== bookmarks.length && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              ({filteredBookmarks.length} {t(locale, 'bookmarks.stats.showing')}
              )
            </p>
          )}
        </div>
        <button
          onClick={handleClearAll}
          className="text-sm font-semibold text-red-600 hover:text-red-700 hover:underline dark:text-rose-300 dark:hover:text-rose-200"
        >
          {t(locale, 'bookmarks.clearAll')}
        </button>
      </div>

      {/* Category filter */}
      {categories.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedCategory === 'all'
                ? 'bg-brand text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {t(locale, 'bookmarks.filter.all')} ({stats.total})
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCategory === category
                  ? 'bg-brand text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {category} ({stats.byCategory[category]})
            </button>
          ))}
        </div>
      )}

      {/* Bookmarked prompts grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bookmarkedPrompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>

      {filteredBookmarks.length === 0 && selectedCategory !== 'all' && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-950/40">
          <p className="text-slate-600 dark:text-slate-300">
            {t(locale, 'bookmarks.category.noBookmarks')}
          </p>
        </div>
      )}
    </div>
  );
}
