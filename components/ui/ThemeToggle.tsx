'use client';

import { useEffect, useState } from 'react';
import { getClientLocale } from '@/lib/i18n/client';
import { t } from '@/lib/i18n/translate';

type Theme = 'light' | 'dark';

function getCurrentTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>('light');
  const locale = getClientLocale();

  useEffect(() => {
    setTheme(getCurrentTheme());
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    if (next === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem('jt_theme', next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === 'dark'}
      className={[
        'inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-slate-600',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span aria-hidden="true" className="text-sm">
        {theme === 'dark' ? '☀️' : '🌙'}
      </span>
      <span className="ml-2 hidden sm:inline">
        {theme === 'dark'
          ? t(locale, 'toggle.theme.light')
          : t(locale, 'toggle.theme.dark')}
      </span>
    </button>
  );
}
