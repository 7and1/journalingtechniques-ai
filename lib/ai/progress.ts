'use client';

import type { AnalysisCallbacks } from './types';

export interface ProgressPayload {
  status?: string;
  loaded?: number;
  total?: number;
  progress?: number;
}

export function handleProgress(
  payload: ProgressPayload,
  callbacks?: AnalysisCallbacks
) {
  if (!callbacks) return;

  if (payload.status && payload.status.includes('download')) {
    callbacks.onModelStatus?.('downloading');
  }

  const derived =
    typeof payload.progress === 'number'
      ? payload.progress * 100
      : typeof payload.loaded === 'number' && typeof payload.total === 'number'
        ? (payload.loaded / payload.total) * 100
        : undefined;

  if (typeof derived === 'number') {
    callbacks.onDownloadProgress?.(Math.min(99, Math.round(derived)));
  }
}
