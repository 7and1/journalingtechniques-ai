'use client';

let transformersPromise: Promise<typeof import('@xenova/transformers')> | null =
  null;

/**
 * Retry helper with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(
          `[Retry] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

export async function loadTransformers() {
  if (typeof window === 'undefined') {
    throw new Error('Transformers.js can only be loaded in the browser.');
  }

  if (!transformersPromise) {
    console.log('[Transformers.js] Starting to load module...');
    transformersPromise = retryWithBackoff(() => import('@xenova/transformers'))
      .then((module) => {
        console.log(
          '[Transformers.js] Module loaded, configuring environment...'
        );

        // Configure Transformers.js environment
        module.env.allowLocalModels = false;
        module.env.allowRemoteModels = true;
        module.env.useBrowserCache = true;

        // Use CDN for WASM files
        if (module.env.backends?.onnx?.wasm) {
          module.env.backends.onnx.wasm.wasmPaths =
            'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.0/dist/';
        }

        console.log('[Transformers.js] Configuration complete');
        console.log('[Transformers.js] Environment:', {
          allowLocalModels: module.env.allowLocalModels,
          allowRemoteModels: module.env.allowRemoteModels,
          useBrowserCache: module.env.useBrowserCache,
        });

        return module;
      })
      .catch((error) => {
        console.error('[Transformers.js] Failed to load:', error);
        transformersPromise = null; // Reset on error
        throw error;
      });
  }

  return transformersPromise;
}
