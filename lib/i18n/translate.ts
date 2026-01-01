import type { Locale, MessageKey } from './messages';
import { MESSAGES } from './messages';

export function t(
  locale: Locale,
  key: MessageKey,
  vars?: Record<string, string | number>
) {
  const table = MESSAGES[locale] ?? MESSAGES.en;
  let message = table[key] ?? MESSAGES.en[key] ?? key;
  if (!vars) return message;
  for (const [name, value] of Object.entries(vars)) {
    message = message.replaceAll(`{${name}}`, String(value));
  }
  return message;
}
