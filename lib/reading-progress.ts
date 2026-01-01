'use client';

import { STORAGE_KEYS } from '@/lib/storage-keys';
import { getRaw, setRaw } from '@/lib/vault';

export interface ReadingProgress {
  slug: string;
  completedAt: string;
  progress: number; // 0-100
}

/**
 * Load all reading progress from localStorage
 */
export async function loadReadingProgress(): Promise<ReadingProgress[]> {
  if (typeof window === 'undefined') return [];
  try {
    const stored = await getRaw(STORAGE_KEYS.readingProgress);
    return stored ? (JSON.parse(stored) as ReadingProgress[]) : [];
  } catch (error) {
    console.error('[Reading Progress] Failed to load:', error);
    return [];
  }
}

/**
 * Save reading progress to localStorage
 */
async function saveReadingProgress(progress: ReadingProgress[]): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    await setRaw(STORAGE_KEYS.readingProgress, JSON.stringify(progress));
  } catch (error) {
    console.error('[Reading Progress] Failed to save:', error);
  }
}

/**
 * Get progress for a specific guide
 */
export async function getGuideProgress(
  slug: string
): Promise<ReadingProgress | null> {
  const progress = await loadReadingProgress();
  return progress.find((p) => p.slug === slug) || null;
}

/**
 * Check if a guide is completed
 */
export async function isGuideCompleted(slug: string): Promise<boolean> {
  const progress = await getGuideProgress(slug);
  return progress !== null && progress.progress === 100;
}

/**
 * Mark a guide as completed
 */
export async function markGuideCompleted(
  slug: string
): Promise<ReadingProgress[]> {
  const progress = await loadReadingProgress();
  const existing = progress.find((p) => p.slug === slug);

  if (existing) {
    existing.progress = 100;
    existing.completedAt = new Date().toISOString();
  } else {
    progress.push({
      slug,
      progress: 100,
      completedAt: new Date().toISOString(),
    });
  }

  await saveReadingProgress(progress);
  return progress;
}

/**
 * Update reading progress for a guide
 */
export async function updateGuideProgress(
  slug: string,
  progressPercent: number
): Promise<ReadingProgress[]> {
  const progress = await loadReadingProgress();
  const existing = progress.find((p) => p.slug === slug);

  const normalizedProgress = Math.min(100, Math.max(0, progressPercent));

  if (existing) {
    existing.progress = normalizedProgress;
    if (normalizedProgress === 100) {
      existing.completedAt = new Date().toISOString();
    }
  } else {
    progress.push({
      slug,
      progress: normalizedProgress,
      completedAt: normalizedProgress === 100 ? new Date().toISOString() : '',
    });
  }

  await saveReadingProgress(progress);
  return progress;
}

/**
 * Clear a guide's progress
 */
export async function clearGuideProgress(
  slug: string
): Promise<ReadingProgress[]> {
  const progress = await loadReadingProgress();
  const updated = progress.filter((p) => p.slug !== slug);
  await saveReadingProgress(updated);
  return updated;
}

/**
 * Get reading statistics
 */
export async function getReadingStats(): Promise<{
  totalCompleted: number;
  totalInProgress: number;
  completedSlugs: string[];
}> {
  const progress = await loadReadingProgress();
  const completed = progress.filter((p) => p.progress === 100);
  const inProgress = progress.filter((p) => p.progress > 0 && p.progress < 100);

  return {
    totalCompleted: completed.length,
    totalInProgress: inProgress.length,
    completedSlugs: completed.map((p) => p.slug),
  };
}

/**
 * Clear all reading progress
 */
export async function clearAllReadingProgress(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    await setRaw(STORAGE_KEYS.readingProgress, null);
  } catch (error) {
    console.error('[Reading Progress] Failed to clear:', error);
  }
}
