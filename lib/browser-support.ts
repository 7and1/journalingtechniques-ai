'use client';

export type BrowserSupportReason =
  | 'no_webassembly'
  | 'no_indexeddb'
  | 'no_localstorage'
  | 'no_fetch';

export interface BrowserSupportResult {
  supported: boolean;
  reason?: BrowserSupportReason;
  features: {
    webassembly: boolean;
    indexedDB: boolean;
    localStorage: boolean;
    fetch: boolean;
  };
}

export function checkBrowserSupport(): BrowserSupportResult {
  if (typeof window === 'undefined') {
    return {
      supported: true, // Server-side, assume supported
      features: {
        webassembly: true,
        indexedDB: true,
        localStorage: true,
        fetch: true,
      },
    };
  }

  const features = {
    webassembly: typeof WebAssembly !== 'undefined',
    indexedDB: typeof window.indexedDB !== 'undefined',
    localStorage: typeof window.localStorage !== 'undefined',
    fetch: typeof window.fetch !== 'undefined',
  };

  // Check WebAssembly (required for Transformers.js)
  if (!features.webassembly) {
    return {
      supported: false,
      reason: 'no_webassembly',
      features,
    };
  }

  // Check IndexedDB (required for model caching)
  if (!features.indexedDB) {
    return {
      supported: false,
      reason: 'no_indexeddb',
      features,
    };
  }

  // Check localStorage (used for analytics flags)
  if (!features.localStorage) {
    return {
      supported: false,
      reason: 'no_localstorage',
      features,
    };
  }

  // Check Fetch API (used for model downloads)
  if (!features.fetch) {
    return {
      supported: false,
      reason: 'no_fetch',
      features,
    };
  }

  return { supported: true, features };
}

export function getBrowserInfo(): { name: string; version: string } {
  if (typeof window === 'undefined') {
    return { name: 'Unknown', version: 'Unknown' };
  }

  const ua = navigator.userAgent;

  // Edge (check before Chrome, as Edge UA contains "Chrome")
  if (ua.includes('Edg')) {
    const match = ua.match(/Edg\/(\d+)/);
    return { name: 'Edge', version: match ? match[1] : 'Unknown' };
  }

  // Chrome
  if (ua.includes('Chrome')) {
    const match = ua.match(/Chrome\/(\d+)/);
    return { name: 'Chrome', version: match ? match[1] : 'Unknown' };
  }

  // Safari
  if (ua.includes('Safari') && !ua.includes('Chrome')) {
    const match = ua.match(/Version\/(\d+)/);
    return { name: 'Safari', version: match ? match[1] : 'Unknown' };
  }

  // Firefox
  if (ua.includes('Firefox')) {
    const match = ua.match(/Firefox\/(\d+)/);
    return { name: 'Firefox', version: match ? match[1] : 'Unknown' };
  }

  return { name: 'Unknown', version: 'Unknown' };
}
