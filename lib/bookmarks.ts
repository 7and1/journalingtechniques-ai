'use client';

import { STORAGE_KEYS } from '@/lib/storage-keys';
import { getRaw, setRaw } from '@/lib/vault';

export interface BookmarkedPrompt {
  id: string;
  category: string;
  bookmarkedAt: string;
}

/**
 * Load all bookmarked prompts from localStorage
 */
export async function loadBookmarks(): Promise<BookmarkedPrompt[]> {
  if (typeof window === 'undefined') return [];
  try {
    const stored = await getRaw(STORAGE_KEYS.bookmarks);
    return stored ? (JSON.parse(stored) as BookmarkedPrompt[]) : [];
  } catch (error) {
    console.error('[Bookmarks] Failed to load:', error);
    return [];
  }
}

/**
 * Save bookmarks to localStorage
 */
async function saveBookmarks(bookmarks: BookmarkedPrompt[]): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    await setRaw(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('[Bookmarks] Failed to save:', error);
  }
}

/**
 * Check if a prompt is bookmarked
 */
export async function isBookmarked(promptId: string): Promise<boolean> {
  const bookmarks = await loadBookmarks();
  return bookmarks.some((b) => b.id === promptId);
}

/**
 * Add a prompt to bookmarks
 */
export async function addBookmark(
  promptId: string,
  category: string
): Promise<BookmarkedPrompt[]> {
  const bookmarks = await loadBookmarks();

  // Don't add duplicates
  if (bookmarks.some((b) => b.id === promptId)) {
    return bookmarks;
  }

  const newBookmark: BookmarkedPrompt = {
    id: promptId,
    category,
    bookmarkedAt: new Date().toISOString(),
  };

  const updated = [newBookmark, ...bookmarks];
  await saveBookmarks(updated);
  return updated;
}

/**
 * Remove a prompt from bookmarks
 */
export async function removeBookmark(
  promptId: string
): Promise<BookmarkedPrompt[]> {
  const bookmarks = await loadBookmarks();
  const updated = bookmarks.filter((b) => b.id !== promptId);
  await saveBookmarks(updated);
  return updated;
}

/**
 * Toggle bookmark status
 */
export async function toggleBookmark(
  promptId: string,
  category: string
): Promise<{
  bookmarks: BookmarkedPrompt[];
  isNowBookmarked: boolean;
}> {
  const wasBookmarked = await isBookmarked(promptId);
  const bookmarks = wasBookmarked
    ? await removeBookmark(promptId)
    : await addBookmark(promptId, category);

  return {
    bookmarks,
    isNowBookmarked: !wasBookmarked,
  };
}

/**
 * Get all bookmarked prompt IDs
 */
export async function getBookmarkedIds(): Promise<string[]> {
  const bookmarks = await loadBookmarks();
  return bookmarks.map((b) => b.id);
}

/**
 * Clear all bookmarks
 */
export async function clearBookmarks(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    await setRaw(STORAGE_KEYS.bookmarks, null);
  } catch (error) {
    console.error('[Bookmarks] Failed to clear:', error);
  }
}

/**
 * Get bookmark statistics
 */
export async function getBookmarkStats(): Promise<{
  total: number;
  byCategory: Record<string, number>;
}> {
  const bookmarks = await loadBookmarks();
  const byCategory: Record<string, number> = {};

  bookmarks.forEach((bookmark) => {
    byCategory[bookmark.category] = (byCategory[bookmark.category] || 0) + 1;
  });

  return {
    total: bookmarks.length,
    byCategory,
  };
}
