import type { Locale } from './messages';

export function getClientLocale(): Locale {
  if (typeof document === 'undefined') return 'en';
  const lang = document.documentElement.lang;
  if (lang && lang.toLowerCase().startsWith('zh')) return 'zh';
  return 'en';
}
