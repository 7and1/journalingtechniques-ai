'use client';

import { getClientLocale } from '@/lib/i18n/client';
import { t } from '@/lib/i18n/translate';

interface ErrorNoticeProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorNotice({ message, onRetry }: ErrorNoticeProps) {
  const locale = getClientLocale();
  const lower = message.toLowerCase();
  const isNetworkError =
    lower.includes('network error') ||
    lower.includes('failed to fetch') ||
    message.includes('网络') ||
    message.includes('无法下载');
  const isSecurityError =
    lower.includes('security error') ||
    lower.includes('cors') ||
    message.includes('安全') ||
    message.includes('跨域');
  const isTimeoutError =
    lower.includes('timeout') ||
    message.includes('超时') ||
    message.includes('超時');

  return (
    <div
      className="rounded-2xl border border-red-200 bg-red-50/70 p-4 text-sm text-red-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200"
      role="alert"
      aria-live="assertive"
    >
      <p className="font-semibold text-red-800 dark:text-rose-100">
        {t(locale, 'error.title')}
      </p>
      <p className="mt-1">{message}</p>

      {/* Show troubleshooting tips for network/security errors */}
      {(isNetworkError || isSecurityError || isTimeoutError) && (
        <div className="mt-3 space-y-2 text-xs">
          <p className="font-semibold">
            {t(locale, 'error.troubleshooting.title')}
          </p>
          <ul className="ml-4 list-disc space-y-1">
            {isNetworkError && (
              <>
                <li>
                  {t(locale, 'error.troubleshooting.network.checkConnection')}
                </li>
                <li>{t(locale, 'error.troubleshooting.network.refresh')}</li>
                <li>{t(locale, 'error.troubleshooting.network.disableVpn')}</li>
              </>
            )}
            {isSecurityError && (
              <>
                <li>
                  {t(
                    locale,
                    'error.troubleshooting.security.disableExtensions'
                  )}
                </li>
                <li>
                  {t(locale, 'error.troubleshooting.security.allowThirdParty')}
                </li>
                <li>
                  {t(
                    locale,
                    'error.troubleshooting.security.tryDifferentBrowser'
                  )}
                </li>
              </>
            )}
            {isTimeoutError && (
              <>
                <li>{t(locale, 'error.troubleshooting.timeout.checkSpeed')}</li>
                <li>{t(locale, 'error.troubleshooting.timeout.tryAgain')}</li>
              </>
            )}
          </ul>
        </div>
      )}

      {/* Show retry button if onRetry is provided */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
        >
          {t(locale, 'error.retry')}
        </button>
      )}
    </div>
  );
}
