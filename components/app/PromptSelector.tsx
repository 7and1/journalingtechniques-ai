'use client';

import { getGuidedPrompts, type PromptTemplateId } from '@/lib/guided-prompts';
import { trackEvent } from '@/lib/analytics';
import { getClientLocale } from '@/lib/i18n/client';
import { t } from '@/lib/i18n/translate';

interface PromptSelectorProps {
  value: PromptTemplateId;
  onChange: (id: PromptTemplateId) => void;
}

export function PromptSelector({ value, onChange }: PromptSelectorProps) {
  const locale = getClientLocale();
  const prompts = getGuidedPrompts(locale);
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/60">
      <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
        {t(locale, 'promptSelector.title')}
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {prompts.map((prompt) => {
          const isActive = prompt.id === value;
          return (
            <button
              key={prompt.id}
              type="button"
              onClick={() => {
                onChange(prompt.id);
                trackEvent('prompt_selected', { prompt_type: prompt.id });
              }}
              className={`rounded-2xl border px-4 py-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand ${
                isActive
                  ? 'border-brand bg-brand/5 text-slate-900 shadow-soft dark:text-slate-50'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900'
              }`}
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {prompt.label}
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {prompt.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
