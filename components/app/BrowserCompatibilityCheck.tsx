'use client';

import { useEffect, useState } from 'react';
import {
  checkBrowserSupport,
  getBrowserInfo,
  type BrowserSupportReason,
} from '@/lib/browser-support';
import { getClientLocale } from '@/lib/i18n/client';
import { t } from '@/lib/i18n/translate';

export function BrowserCompatibilityCheck() {
  const locale = getClientLocale();
  const [showWarning, setShowWarning] = useState(false);
  const [reason, setReason] = useState<BrowserSupportReason | 'generic'>(
    'generic'
  );

  useEffect(() => {
    const support = checkBrowserSupport();
    if (!support.supported) {
      setShowWarning(true);
      setReason(support.reason ?? 'generic');
      console.warn('[Browser Compatibility]', support);
    } else {
      const info = getBrowserInfo();
      console.info(
        `[Browser Compatibility] ✅ ${info.name} ${info.version} is supported`
      );
    }
  }, []);

  if (!showWarning) return null;

  const reasonKey =
    reason === 'no_webassembly'
      ? 'browserWarning.reason.noWebAssembly'
      : reason === 'no_indexeddb'
        ? 'browserWarning.reason.noIndexedDB'
        : reason === 'no_localstorage'
          ? 'browserWarning.reason.noLocalStorage'
          : reason === 'no_fetch'
            ? 'browserWarning.reason.noFetch'
            : 'browserWarning.reason.generic';

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-yellow-400 bg-yellow-50 p-4 shadow-lg">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-900">
            {t(locale, 'browserWarning.title')}
          </h3>
          <p className="mt-1 text-sm text-yellow-800">{t(locale, reasonKey)}</p>
        </div>
        <div className="flex gap-2">
          <a
            href="https://www.google.com/chrome/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-700"
          >
            {t(locale, 'browserWarning.getChrome')}
          </a>
          <button
            onClick={() => setShowWarning(false)}
            className="inline-flex items-center rounded-full border border-yellow-600 px-4 py-2 text-sm font-semibold text-yellow-900 transition hover:bg-yellow-100"
          >
            {t(locale, 'browserWarning.dismiss')}
          </button>
        </div>
      </div>
    </div>
  );
}
