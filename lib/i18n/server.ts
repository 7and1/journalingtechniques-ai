import type { Locale } from './messages';
import { cookies, headers } from 'next/headers';

const LOCALE_COOKIE = 'jt_locale';

function normalizeLocale(value: string | undefined | null): Locale | null {
  if (!value) return null;
  const lower = value.toLowerCase();
  if (lower.startsWith('zh')) return 'zh';
  if (lower.startsWith('en')) return 'en';
  return null;
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const fromCookie = normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  if (fromCookie) return fromCookie;

  const accept = (await headers()).get('accept-language') ?? '';
  const first = accept.split(',')[0]?.trim();
  const fromHeader = normalizeLocale(first);
  return fromHeader ?? 'en';
}
