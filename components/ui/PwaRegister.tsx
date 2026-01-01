'use client';

import { useEffect } from 'react';

export function PwaRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      } catch (error) {
        console.warn('[PWA] Service worker registration failed', error);
      }
    };

    // Avoid blocking first paint.
    const requestIdleCallback = (
      window as Partial<{
        requestIdleCallback: (callback: () => void) => number;
      }>
    ).requestIdleCallback;
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(() => void register());
    } else {
      setTimeout(register, 1);
    }
  }, []);

  return null;
}
