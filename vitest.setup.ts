import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.plausible for analytics tests
globalThis.window = globalThis.window || ({} as any);
globalThis.window.plausible = () => {};
