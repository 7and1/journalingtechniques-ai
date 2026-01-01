'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { GuideMeta } from '@/lib/guides';
import { isGuideCompleted } from '@/lib/reading-progress';

interface GuideCardProps {
  guide: GuideMeta;
}

export function GuideCard({ guide }: GuideCardProps) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void isGuideCompleted(guide.slug).then((value) => {
      if (!cancelled) setCompleted(value);
    });
    const handler = () => {
      void isGuideCompleted(guide.slug).then((value) => {
        if (!cancelled) setCompleted(value);
      });
    };
    window.addEventListener('jt_vault_change', handler);
    return () => {
      cancelled = true;
      window.removeEventListener('jt_vault_change', handler);
    };
  }, [guide.slug]);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">
          {guide.publishedAt
            ? new Date(guide.publishedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              })
            : 'Guide'}
        </p>
        {completed && (
          <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-emerald-950/40 dark:text-emerald-200">
            <span>✓</span>
            <span>Read</span>
          </span>
        )}
      </div>
      <h3 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-50">
        {guide.title}
      </h3>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        {guide.description}
      </p>
      {guide.tags?.length ? (
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {guide.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-6 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <p>{guide.readingTime ?? '10 min read'}</p>
        <Link
          href={`/guides/${guide.slug}`}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:border-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600"
        >
          Read guide →
        </Link>
      </div>
    </article>
  );
}
