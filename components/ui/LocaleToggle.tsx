'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n/messages';
import { t } from '@/lib/i18n/translate';
import { getClientLocale } from '@/lib/i18n/client';

function setCookie(name: string, value: string) {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
}

export function LocaleToggle({ className }: { className?: string }) {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    setLocale(getClientLocale());
  }, []);

  const toggle = () => {
    const next: Locale = locale === 'zh' ? 'en' : 'zh';
    setCookie('jt_locale', next);
    setLocale(next);
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={[
        'inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-slate-600',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      title={locale === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      {locale === 'zh'
        ? t('zh', 'toggle.locale.en')
        : t('en', 'toggle.locale.zh')}
    </button>
  );
}
