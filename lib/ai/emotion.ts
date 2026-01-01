'use client';

import type { AnalysisCallbacks, EmotionInsight, EmotionLabel } from './types';
import { handleProgress, type ProgressPayload } from './progress';
import { loadTransformers } from './loaders';

const MODEL_NAME = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
type EmotionPipeline = (
  text: string,
  options?: Record<string, unknown>
) => Promise<Array<{ label: string; score: number }>>;
let emotionPipeline: EmotionPipeline | null = null;

export async function analyzeEmotion(
  text: string,
  callbacks?: AnalysisCallbacks
): Promise<EmotionInsight> {
  try {
    const pipeline = await getEmotionPipeline(callbacks);
    const result = await pipeline(text, { topk: 1 });
    const { label, score } = result[0];
    const confidence = Math.min(1, Math.max(0, score));

    return mapEmotion(label as EmotionLabel, confidence);
  } catch (error) {
    console.error('[Emotion Analysis Error]', error);

    // Provide user-friendly error messages based on error type
    let errorMessage = 'Failed to analyze emotion';

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
        errorMessage = `Failed to analyze emotion: ${error.message}`;
      }
    }

    throw new Error(errorMessage);
  }
}

async function getEmotionPipeline(callbacks?: AnalysisCallbacks) {
  if (emotionPipeline) return emotionPipeline;

  console.log('[Emotion Pipeline] Loading Transformers.js...');
  const { pipeline } = await loadTransformers();

  console.log('[Emotion Pipeline] Creating pipeline with model:', MODEL_NAME);
  callbacks?.onModelStatus?.('downloading');

  // Retry pipeline creation with exponential backoff
  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      emotionPipeline = (await pipeline('text-classification', MODEL_NAME, {
        progress_callback: (payload: ProgressPayload) => {
          console.log('[Emotion Pipeline] Progress:', payload);
          handleProgress(payload, callbacks);
        },
      })) as EmotionPipeline;

      console.log('[Emotion Pipeline] Pipeline created successfully');
      callbacks?.onModelStatus?.('ready');

      return emotionPipeline;
    } catch (error) {
      retryCount++;
      console.error(
        `[Emotion Pipeline] Attempt ${retryCount}/${maxRetries} failed:`,
        error
      );

      if (retryCount < maxRetries) {
        const delay = 1000 * Math.pow(2, retryCount - 1); // 1s, 2s, 4s
        console.log(`[Emotion Pipeline] Retrying in ${delay}ms...`);
        callbacks?.onModelStatus?.('downloading'); // Keep showing downloading status
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        // Final attempt failed
        emotionPipeline = null;
        throw error;
      }
    }
  }

  throw new Error('Max retries exceeded while creating emotion pipeline');
}

function mapEmotion(label: EmotionLabel, confidence: number): EmotionInsight {
  if (label === 'NEGATIVE') {
    if (confidence > 0.9) {
      return {
        emoji: '😰',
        tone: 'anxious or distressed',
        text: `Your writing suggests intense anxious or distressed energy with ${Math.round(confidence * 100)}% confidence.`,
        confidence,
        rawLabel: label,
      };
    }
    if (confidence > 0.7) {
      return {
        emoji: '😔',
        tone: 'frustrated or disappointed',
        text: `There's a clear thread of frustration or disappointment (${Math.round(confidence * 100)}% confidence).`,
        confidence,
        rawLabel: label,
      };
    }
    return {
      emoji: '😐',
      tone: 'slightly negative',
      text: `The tone leans mildly negative, suggesting lingering tension (${Math.round(confidence * 100)}% confidence).`,
      confidence,
      rawLabel: label,
    };
  }

  if (confidence > 0.9) {
    return {
      emoji: '😊',
      tone: 'joyful or excited',
      text: `This entry radiates joy or excitement with ${Math.round(confidence * 100)}% confidence.`,
      confidence,
      rawLabel: label,
    };
  }
  if (confidence > 0.7) {
    return {
      emoji: '🙂',
      tone: 'hopeful or encouraged',
      text: `There's a hopeful, encouraged tone (${Math.round(confidence * 100)}% confidence).`,
      confidence,
      rawLabel: label,
    };
  }
  return {
    emoji: '😌',
    tone: 'calm or neutral-positive',
    text: `The tone feels calm with subtle optimism (${Math.round(confidence * 100)}% confidence).`,
    confidence,
    rawLabel: label,
  };
}
