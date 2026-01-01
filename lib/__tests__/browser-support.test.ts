import { describe, it, expect, beforeEach } from 'vitest';
import { checkBrowserSupport, getBrowserInfo } from '../browser-support';

describe('checkBrowserSupport', () => {
  beforeEach(() => {
    // Reset global window mock with proper typing
    const mockWindow = {
      indexedDB: {},
      localStorage: {},
      fetch: () => Promise.resolve({} as Response),
    };
    globalThis.window = mockWindow as unknown as Window & typeof globalThis;
    // @ts-expect-error - Mocking WebAssembly for tests
    globalThis.WebAssembly = {};
  });

  it('should return supported when all features are available', () => {
    const result = checkBrowserSupport();

    expect(result.supported).toBe(true);
    expect(result.features.webassembly).toBe(true);
    expect(result.features.indexedDB).toBe(true);
    expect(result.features.localStorage).toBe(true);
    expect(result.features.fetch).toBe(true);
  });

  it('should detect missing WebAssembly', () => {
    // @ts-expect-error - Mocking WebAssembly for tests
    globalThis.WebAssembly = undefined;

    const result = checkBrowserSupport();

    expect(result.supported).toBe(false);
    expect(result.reason).toBe('no_webassembly');
    expect(result.features.webassembly).toBe(false);
  });

  it('should detect missing IndexedDB', () => {
    const mockWindow = { ...globalThis.window, indexedDB: undefined };
    globalThis.window = mockWindow as unknown as Window & typeof globalThis;

    const result = checkBrowserSupport();

    expect(result.supported).toBe(false);
    expect(result.reason).toBe('no_indexeddb');
    expect(result.features.indexedDB).toBe(false);
  });

  it('should detect missing localStorage', () => {
    const mockWindow = { ...globalThis.window, localStorage: undefined };
    globalThis.window = mockWindow as unknown as Window & typeof globalThis;

    const result = checkBrowserSupport();

    expect(result.supported).toBe(false);
    expect(result.reason).toBe('no_localstorage');
    expect(result.features.localStorage).toBe(false);
  });

  it('should detect missing Fetch API', () => {
    const mockWindow = { ...globalThis.window, fetch: undefined };
    globalThis.window = mockWindow as unknown as Window & typeof globalThis;

    const result = checkBrowserSupport();

    expect(result.supported).toBe(false);
    expect(result.reason).toBe('no_fetch');
    expect(result.features.fetch).toBe(false);
  });
});

describe('getBrowserInfo', () => {
  beforeEach(() => {
    // Reset navigator mock
    Object.defineProperty(globalThis.navigator, 'userAgent', {
      value: '',
      writable: true,
      configurable: true,
    });
  });

  it('should detect Chrome', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      writable: true,
    });

    const info = getBrowserInfo();
    expect(info.name).toBe('Chrome');
    expect(info.version).toBe('120');
  });

  it('should detect Safari', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
      writable: true,
    });

    const info = getBrowserInfo();
    expect(info.name).toBe('Safari');
    expect(info.version).toBe('17');
  });

  it('should detect Firefox', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
      writable: true,
    });

    const info = getBrowserInfo();
    expect(info.name).toBe('Firefox');
    expect(info.version).toBe('120');
  });

  it('should detect Edge', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
      writable: true,
    });

    const info = getBrowserInfo();
    expect(info.name).toBe('Edge');
    expect(info.version).toBe('120');
  });

  it('should return Unknown for unrecognized browsers', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Unknown Browser',
      writable: true,
    });

    const info = getBrowserInfo();
    expect(info.name).toBe('Unknown');
    expect(info.version).toBe('Unknown');
  });
});
