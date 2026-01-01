'use client';

import { useState, useEffect } from 'react';
import { isBookmarked, toggleBookmark } from '@/lib/bookmarks';
import { getClientLocale } from '@/lib/i18n/client';
import { t } from '@/lib/i18n/translate';

interface BookmarkButtonProps {
  promptId: string;
  category: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BookmarkButton({
  promptId,
  category,
  size = 'md',
}: BookmarkButtonProps) {
  const locale = getClientLocale();
  const [bookmarked, setBookmarked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void isBookmarked(promptId).then((value) => {
      if (!cancelled) setBookmarked(value);
    });
    const handler = () => {
      void isBookmarked(promptId).then((value) => {
        if (!cancelled) setBookmarked(value);
      });
    };
    window.addEventListener('jt_vault_change', handler);
    return () => {
      cancelled = true;
      window.removeEventListener('jt_vault_change', handler);
    };
  }, [promptId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Don't trigger parent link clicks
    e.stopPropagation();

    const { isNowBookmarked } = await toggleBookmark(promptId, category);
    setBookmarked(isNowBookmarked);

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-base',
    md: 'w-10 h-10 text-lg',
    lg: 'w-12 h-12 text-xl',
  };

  return (
    <button
      onClick={handleToggle}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full transition-all ${
        bookmarked
          ? 'bg-brand/10 text-brand hover:bg-brand/20'
          : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300'
      } ${isAnimating ? 'scale-125' : 'scale-100'}`}
      aria-label={
        bookmarked
          ? t(locale, 'bookmarks.button.remove')
          : t(locale, 'bookmarks.button.add')
      }
      title={
        bookmarked
          ? t(locale, 'bookmarks.button.removeTitle')
          : t(locale, 'bookmarks.button.addTitle')
      }
    >
      {bookmarked ? '★' : '☆'}
    </button>
  );
}
