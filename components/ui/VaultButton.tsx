'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  changeVaultPassword,
  disableVault,
  enableVault,
  getVaultStatus,
  lockVault,
  unlockVault,
} from '@/lib/vault';
import { getClientLocale } from '@/lib/i18n/client';
import { t } from '@/lib/i18n/translate';

type Mode = 'closed' | 'setup' | 'unlock' | 'manage' | 'change';

export function VaultButton({ className }: { className?: string }) {
  const locale = getClientLocale();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(() => getVaultStatus());
  const [mode, setMode] = useState<Mode>('closed');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  useEffect(() => {
    const handler = () => setStatus(getVaultStatus());
    window.addEventListener('jt_vault_change', handler);
    handler();
    return () => window.removeEventListener('jt_vault_change', handler);
  }, []);

  useEffect(() => {
    if (!open) {
      setMode('closed');
      setError(null);
      setPassword('');
      setPassword2('');
      setBusy(false);
      return;
    }

    if (!status.enabled) setMode('setup');
    else if (!status.unlocked) setMode('unlock');
    else setMode('manage');
  }, [open, status.enabled, status.unlocked]);

  const buttonLabel = useMemo(() => {
    if (!status.enabled) return t(locale, 'vault.setPassword');
    if (!status.unlocked) return t(locale, 'vault.locked');
    return t(locale, 'vault.unlocked');
  }, [locale, status.enabled, status.unlocked]);

  const buttonIcon = status.enabled ? (status.unlocked ? '🔓' : '🔒') : '🔐';

  const submitSetup = async () => {
    setError(null);
    if (password.length < 8) {
      setError(t(locale, 'vault.error.passwordTooShort'));
      return;
    }
    if (password !== password2) {
      setError(t(locale, 'vault.error.passwordsNotMatch'));
      return;
    }

    setBusy(true);
    try {
      await enableVault(password);
      setOpen(false);
    } catch (e) {
      console.error(e);
      setError(t(locale, 'vault.error.enableFailed'));
    } finally {
      setBusy(false);
    }
  };

  const submitUnlock = async () => {
    setError(null);
    setBusy(true);
    try {
      const ok = await unlockVault(password);
      if (!ok) {
        setError(t(locale, 'vault.error.incorrectPassword'));
        return;
      }
      setOpen(false);
    } catch (e) {
      console.error(e);
      setError(t(locale, 'vault.error.unlockFailed'));
    } finally {
      setBusy(false);
    }
  };

  const submitChangePassword = async () => {
    setError(null);
    if (password.length < 8) {
      setError(t(locale, 'vault.error.newPasswordTooShort'));
      return;
    }
    if (password !== password2) {
      setError(t(locale, 'vault.error.newPasswordsNotMatch'));
      return;
    }

    setBusy(true);
    try {
      await changeVaultPassword(password);
      setOpen(false);
    } catch (e) {
      console.error(e);
      setError(t(locale, 'vault.error.changeFailed'));
    } finally {
      setBusy(false);
    }
  };

  const doLock = () => {
    lockVault();
    setOpen(false);
  };

  const doDisable = async () => {
    const ok = window.confirm(t(locale, 'vault.confirmDisable'));
    if (!ok) return;

    setBusy(true);
    setError(null);
    try {
      await disableVault();
      setOpen(false);
    } catch (e) {
      console.error(e);
      setError(t(locale, 'vault.error.disableFailed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={[
          'inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-slate-600',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        title={t(locale, 'vault.description')}
      >
        <span aria-hidden="true">{buttonIcon}</span>
        <span className="ml-2 hidden sm:inline">{buttonLabel}</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/50"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                  {t(locale, 'vault.title')}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  {status.enabled
                    ? status.unlocked
                      ? t(locale, 'vault.unlockTitle')
                      : t(locale, 'vault.lockedTitle')
                    : t(locale, 'vault.setupTitle')}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {t(locale, 'vault.description')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                ✕
              </button>
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/60 p-4 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-100">
                {error}
              </div>
            ) : null}

            {mode === 'setup' ? (
              <div className="mt-6 space-y-3">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t(locale, 'vault.passwordPlaceholder')}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                />
                <input
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  placeholder={t(locale, 'vault.confirmPasswordPlaceholder')}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                />
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void submitSetup()}
                  className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy
                    ? t(locale, 'vault.enablingButton')
                    : t(locale, 'vault.enableButton')}
                </button>
              </div>
            ) : null}

            {mode === 'unlock' ? (
              <div className="mt-6 space-y-3">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t(locale, 'vault.unlockPlaceholder')}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                />
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void submitUnlock()}
                  className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy
                    ? t(locale, 'vault.unlockingButton')
                    : t(locale, 'vault.unlockButton')}
                </button>
              </div>
            ) : null}

            {mode === 'manage' ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={doLock}
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                >
                  {t(locale, 'vault.lockButton')}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('change')}
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                >
                  {t(locale, 'vault.changePasswordButton')}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void doDisable()}
                  className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-950/60 sm:col-span-2"
                >
                  {busy
                    ? t(locale, 'vault.workingButton')
                    : t(locale, 'vault.disableButton')}
                </button>
              </div>
            ) : null}

            {mode === 'change' ? (
              <div className="mt-6 space-y-3">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t(locale, 'vault.newPasswordPlaceholder')}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                />
                <input
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  placeholder={t(locale, 'vault.confirmNewPasswordPlaceholder')}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void submitChangePassword()}
                    className="flex-1 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busy
                      ? t(locale, 'vault.savingButton')
                      : t(locale, 'vault.saveButton')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('manage')}
                    className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                  >
                    {t(locale, 'vault.backButton')}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
