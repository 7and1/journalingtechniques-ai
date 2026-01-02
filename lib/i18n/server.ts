import type { Locale } from './messages';

// For static export, use default locale. Client-side hydration will
// update based on user's actual preference via getClientLocale().
export async function getLocale(): Promise<Locale> {
  return 'en';
}
