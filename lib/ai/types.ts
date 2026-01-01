'use client';

export type EmotionLabel = 'POSITIVE' | 'NEGATIVE';

export interface EmotionInsight {
  emoji: string;
  tone: string;
  text: string;
  confidence: number;
  rawLabel: EmotionLabel;
}

export interface ThemeInsight {
  emoji: string;
  title: string;
  text: string;
  rawSummary: string;
}

export interface ReflectionInsight {
  emoji: string;
  question: string;
  technique: string;
}

export interface InsightBundle {
  emotion: EmotionInsight;
  theme: ThemeInsight;
  reflection: ReflectionInsight;
}

export type ModelStatus = 'idle' | 'downloading' | 'ready';

export interface AnalysisCallbacks {
  onModelStatus?: (status: ModelStatus) => void;
  onDownloadProgress?: (progress: number) => void;
}
