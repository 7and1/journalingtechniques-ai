'use client';

import { useState, useEffect } from 'react';
import {
  isGuideCompleted,
  markGuideCompleted,
  clearGuideProgress,
} from '@/lib/reading-progress';

interface ReadingProgressButtonProps {
  slug: string;
}

export function ReadingProgressButton({ slug }: ReadingProgressButtonProps) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void isGuideCompleted(slug).then((value) => {
      if (!cancelled) setCompleted(value);
    });
    const handler = () => {
      void isGuideCompleted(slug).then((value) => {
        if (!cancelled) setCompleted(value);
      });
    };
    window.addEventListener('jt_vault_change', handler);
    return () => {
      cancelled = true;
      window.removeEventListener('jt_vault_change', handler);
    };
  }, [slug]);

  const handleToggle = async () => {
    if (completed) {
      await clearGuideProgress(slug);
      setCompleted(false);
    } else {
      await markGuideCompleted(slug);
      setCompleted(true);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 rounded-full border px-6 py-3 font-semibold transition ${
        completed
          ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200 dark:hover:bg-emerald-950/60'
          : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900'
      }`}
    >
      {completed ? (
        <>
          <span>✓</span>
          <span>Completed</span>
        </>
      ) : (
        <>
          <span>☐</span>
          <span>Mark as read</span>
        </>
      )}
    </button>
  );
}
