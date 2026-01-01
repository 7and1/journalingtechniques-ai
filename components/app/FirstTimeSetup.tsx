'use client';

import { getClientLocale } from '@/lib/i18n/client';
import { t } from '@/lib/i18n/translate';

interface FirstTimeSetupProps {
  progress: number;
}

export function FirstTimeSetup({ progress }: FirstTimeSetupProps) {
  const locale = getClientLocale();
  const progressPercent = Math.min(progress, 100);

  return (
    <div
      className="rounded-2xl border border-blue-100 bg-white/90 p-6 text-left shadow-soft dark:border-slate-800 dark:bg-slate-950/40"
      role="status"
      aria-live="polite"
      aria-label="AI models download progress"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-500">
        {t(locale, 'firstTimeSetup.kicker')}
      </p>
      <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-50">
        {t(locale, 'firstTimeSetup.title')}
      </h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {t(locale, 'firstTimeSetup.body')}
      </p>
      <div
        className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Download progress: ${progressPercent} percent`}
      >
        <div
          className="h-full rounded-full bg-brand transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
        {t(locale, 'firstTimeSetup.footer', { progress: progressPercent })}
      </p>
    </div>
  );
}
