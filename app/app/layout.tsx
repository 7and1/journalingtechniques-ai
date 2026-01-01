import type { ReactNode } from 'react';
import { BrowserCompatibilityCheck } from '@/components/app/BrowserCompatibilityCheck';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LocaleToggle } from '@/components/ui/LocaleToggle';
import { VaultButton } from '@/components/ui/VaultButton';
import { getLocale } from '@/lib/i18n/server';
import { t } from '@/lib/i18n/translate';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <BrowserCompatibilityCheck />
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
              {t(locale, 'app.header.kicker')}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-50">
              {t(locale, 'app.header.title')}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {t(locale, 'app.header.subtitle')}
            </p>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <LocaleToggle />
            <ThemeToggle />
            <VaultButton />
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
