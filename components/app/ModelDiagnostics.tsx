'use client';

import { useState } from 'react';
import { getClientLocale } from '@/lib/i18n/client';
import { t } from '@/lib/i18n/translate';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'failed' | 'pending';
  message: string;
}

export function ModelDiagnostics() {
  const locale = getClientLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);

    const diagnostics: DiagnosticResult[] = [];

    // Test 1: Check localStorage availability
    diagnostics.push({
      test: 'LocalStorage',
      status:
        typeof window !== 'undefined' && window.localStorage
          ? 'success'
          : 'failed',
      message:
        typeof window !== 'undefined' && window.localStorage
          ? 'localStorage is available'
          : 'localStorage is not available',
    });
    setResults([...diagnostics]);

    // Test 2: Check basic network connectivity (respects CSP)
    try {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        throw new Error('Browser reports offline mode');
      }

      await fetch('https://plausible.io/js/script.js', { mode: 'no-cors' });
      diagnostics.push({
        test: 'Network Connection',
        status: 'success',
        message: 'Network is accessible',
      });
    } catch (error) {
      diagnostics.push({
        test: 'Network Connection',
        status: 'failed',
        message: `Network error: ${error instanceof Error ? error.message : 'Unknown'}`,
      });
    }
    setResults([...diagnostics]);

    // Test 3: Check HuggingFace CDN accessibility
    try {
      await fetch('https://huggingface.co/', { mode: 'no-cors' });
      diagnostics.push({
        test: 'HuggingFace CDN',
        status: 'success',
        message: 'HuggingFace is accessible',
      });
    } catch (error) {
      diagnostics.push({
        test: 'HuggingFace CDN',
        status: 'failed',
        message: `Cannot reach HuggingFace: ${error instanceof Error ? error.message : 'Unknown'}`,
      });
    }
    setResults([...diagnostics]);

    // Test 4: Check jsdelivr CDN
    try {
      const response = await fetch(
        'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.0/package.json'
      );
      const data = await response.json();
      diagnostics.push({
        test: 'jsdelivr CDN (WASM files)',
        status: 'success',
        message: `Version ${data.version} accessible`,
      });
    } catch (error) {
      diagnostics.push({
        test: 'jsdelivr CDN (WASM files)',
        status: 'failed',
        message: `Cannot reach jsdelivr: ${error instanceof Error ? error.message : 'Unknown'}`,
      });
    }
    setResults([...diagnostics]);

    // Test 5: Check if CORS is blocking
    try {
      await fetch('https://cdn-lfs.huggingface.co/', { mode: 'cors' });
      diagnostics.push({
        test: 'CORS Policy',
        status: 'success',
        message: 'CORS allows requests to HuggingFace',
      });
    } catch (error) {
      diagnostics.push({
        test: 'CORS Policy',
        status: 'failed',
        message: `CORS error: ${error instanceof Error ? error.message : 'May be blocked by browser/extension'}`,
      });
    }
    setResults([...diagnostics]);

    // Test 6: Check Transformers.js import
    try {
      await import('@xenova/transformers');
      diagnostics.push({
        test: 'Transformers.js Module',
        status: 'success',
        message: 'Module loaded successfully',
      });
    } catch (error) {
      diagnostics.push({
        test: 'Transformers.js Module',
        status: 'failed',
        message: `Module error: ${error instanceof Error ? error.message : 'Unknown'}`,
      });
    }
    setResults([...diagnostics]);

    setIsRunning(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
      >
        {t(locale, 'diagnostics.button')}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
          {t(locale, 'diagnostics.title')}
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
        >
          ✕
        </button>
      </div>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {t(locale, 'diagnostics.subtitle')}
      </p>

      <button
        onClick={runDiagnostics}
        disabled={isRunning}
        className="mt-4 w-full rounded-full bg-brand px-4 py-2 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
      >
        {isRunning
          ? t(locale, 'diagnostics.running')
          : t(locale, 'diagnostics.run')}
      </button>

      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          {results.map((result, index) => (
            <div
              key={index}
              className={`rounded-lg border p-3 ${
                result.status === 'success'
                  ? 'border-green-200 bg-green-50 dark:border-emerald-900/50 dark:bg-emerald-950/40'
                  : result.status === 'failed'
                    ? 'border-red-200 bg-red-50 dark:border-rose-900/50 dark:bg-rose-950/40'
                    : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {result.test}
                </p>
                <span className="text-lg">
                  {result.status === 'success'
                    ? '✓'
                    : result.status === 'failed'
                      ? '✗'
                      : '⋯'}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                {result.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {results.length > 0 && !isRunning && (
        <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-900 dark:bg-blue-950/40 dark:text-blue-100">
          <p className="font-semibold">
            {t(locale, 'diagnostics.troubleshooting')}
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
            {results.some((r) => r.status === 'failed') && (
              <>
                <li>{t(locale, 'diagnostics.tip.disableExtensions')}</li>
                <li>{t(locale, 'diagnostics.tip.checkConnection')}</li>
                <li>{t(locale, 'diagnostics.tip.tryDifferentBrowser')}</li>
                <li>{t(locale, 'diagnostics.tip.disableVPN')}</li>
                <li>{t(locale, 'diagnostics.tip.checkFirewall')}</li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
