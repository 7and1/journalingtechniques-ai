'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Prompt } from '@/lib/prompts';
import { BookmarkButton } from './BookmarkButton';
import { getClientLocale } from '@/lib/i18n/client';
import { t } from '@/lib/i18n/translate';

interface PromptCardProps {
  prompt: Prompt;
  variant?: 'default' | 'compact';
}

export function PromptCard({ prompt, variant = 'default' }: PromptCardProps) {
  const locale = getClientLocale();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.warn('[PromptCard] Failed to copy', error);
    }
  };

  const baseClasses =
    'rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950/40';

  return (
    <article className={baseClasses} aria-label={`Prompt ${prompt.id}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">
            <span>{prompt.category}</span>
            {prompt.difficulty ? <span>{prompt.difficulty}</span> : null}
          </div>
        </div>
        <BookmarkButton
          promptId={prompt.id}
          category={prompt.category}
          size="sm"
        />
      </div>
      <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
        {prompt.text}
      </p>
      {prompt.description ? (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {prompt.description}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        {prompt.technique ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
            {prompt.technique}
          </span>
        ) : null}
        {prompt.subcategory ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
            {prompt.subcategory}
          </span>
        ) : null}
      </div>
      <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
        >
          {copied
            ? t(locale, 'promptCard.copied')
            : t(locale, 'promptCard.copy')}
        </button>
        <Link
          href={`/app?prefill=${encodeURIComponent(prompt.text)}`}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-white shadow-soft transition hover:bg-brand-dark"
        >
          {t(locale, 'promptCard.tryWithAI')}
        </Link>
      </div>
      {variant === 'default' && prompt.aiSuggestion ? (
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          {prompt.aiSuggestion}
        </p>
      ) : null}
    </article>
  );
}
