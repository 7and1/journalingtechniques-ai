'use client';

import type { AnalysisCallbacks, ThemeInsight } from './types';
import { handleProgress, type ProgressPayload } from './progress';
import { loadTransformers } from './loaders';

const MODEL_NAME = 'Xenova/distilbart-cnn-6-6';
type SummarizationPipeline = (
  text: string,
  options?: Record<string, unknown>
) => Promise<Array<{ summary_text: string }>>;
let themePipeline: SummarizationPipeline | null = null;

export async function extractTheme(
  text: string,
  callbacks?: AnalysisCallbacks
): Promise<ThemeInsight> {
  try {
    const trimmed = text.length > 2000 ? text.slice(-2000) : text;
    const pipeline = await getThemePipeline(callbacks);
    const [result] = await pipeline(trimmed, {
      min_length: 10,
      max_length: 40,
      do_sample: false,
    });
    const summary = result.summary_text.replace(/\s+/g, ' ').trim();

    return {
      emoji: '🔍',
      title: "What you're processing",
      text: `You seem to be working through ${summary}.`,
      rawSummary: summary,
    };
  } catch (error) {
    console.error('[Theme Analysis Error]', error);

    // Provide user-friendly error messages
    let errorMessage = 'Failed to extract theme';

    if (error instanceof Error) {
      if (
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError')
      ) {
        errorMessage =
          'Network error: Unable to download AI model. Please check your internet connection and try again.';
      } else if (error.message.includes('CORS')) {
        errorMessage =
          'Security error: Unable to access AI model. Try disabling browser extensions that block requests.';
      } else if (error.message.includes('timeout')) {
        errorMessage =
          'Timeout error: Model download took too long. Please try again.';
      } else {
        errorMessage = `Failed to extract theme: ${error.message}`;
      }
    }

    throw new Error(errorMessage);
  }
}

async function getThemePipeline(callbacks?: AnalysisCallbacks) {
  if (themePipeline) return themePipeline;

  console.log('[Theme Pipeline] Loading Transformers.js...');
  const { pipeline } = await loadTransformers();

  console.log('[Theme Pipeline] Creating pipeline with model:', MODEL_NAME);
  callbacks?.onModelStatus?.('downloading');

  // Retry pipeline creation with exponential backoff
  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      themePipeline = (await pipeline('summarization', MODEL_NAME, {
        progress_callback: (payload: ProgressPayload) => {
          console.log('[Theme Pipeline] Progress:', payload);
          handleProgress(payload, callbacks);
        },
      })) as SummarizationPipeline;

      console.log('[Theme Pipeline] Pipeline created successfully');
      return themePipeline;
    } catch (error) {
      retryCount++;
      console.error(
        `[Theme Pipeline] Attempt ${retryCount}/${maxRetries} failed:`,
        error
      );

      if (retryCount < maxRetries) {
        const delay = 1000 * Math.pow(2, retryCount - 1); // 1s, 2s, 4s
        console.log(`[Theme Pipeline] Retrying in ${delay}ms...`);
        callbacks?.onModelStatus?.('downloading');
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        // Final attempt failed
        themePipeline = null;
        throw error;
      }
    }
  }

  throw new Error('Max retries exceeded while creating theme pipeline');
}
