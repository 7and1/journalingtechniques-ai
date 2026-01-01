import type { ReactNode } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LocaleToggle } from '@/components/ui/LocaleToggle';
import { VaultButton } from '@/components/ui/VaultButton';
import { getLocale } from '@/lib/i18n/server';
import { t } from '@/lib/i18n/translate';

export default async function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  return (
    <div className="min-h-screen bg-gradient-to-b from-surface via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 dark:text-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/90 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/70">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50"
          >
            journalingtechniques.ai
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link
              href="/prompts"
              className="hover:text-slate-900 dark:hover:text-slate-50"
            >
              {t(locale, 'nav.prompts')}
            </Link>
            <Link
              href="/guides"
              className="hover:text-slate-900 dark:hover:text-slate-50"
            >
              {t(locale, 'nav.guides')}
            </Link>
            <Link
              href="/bookmarks"
              className="hover:text-slate-900 dark:hover:text-slate-50"
            >
              {t(locale, 'nav.bookmarks')}
            </Link>
            <Link
              href="/#how-it-works"
              className="hover:text-slate-900 dark:hover:text-slate-50"
            >
              {t(locale, 'nav.howItWorks')}
            </Link>
            <Link
              href="/privacy"
              className="hover:text-slate-900 dark:hover:text-slate-50"
            >
              {t(locale, 'nav.privacy')}
            </Link>
            <ThemeToggle />
            <LocaleToggle />
            <VaultButton />
            <Link
              href="/app"
              className="rounded-full bg-brand px-4 py-2 text-white shadow-soft transition hover:bg-brand-dark"
            >
              {t(locale, 'nav.launchApp')}
            </Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t border-slate-200/60 bg-white py-10 text-sm text-slate-500 dark:border-slate-800/80 dark:bg-slate-950/70 dark:text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} journalingtechniques.ai. Built with a
            privacy-first mindset.
          </p>
          <p>
            🔒 Your journal never leaves your device —{' '}
            <Link
              href="/privacy"
              className="font-semibold text-brand hover:text-brand-dark"
            >
              learn why
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
