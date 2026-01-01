export const STORAGE_KEYS = {
  draft: 'jt_draft_v1',
  history: 'jt_history_v1',
  bookmarks: 'jt_bookmarked_prompts',
  readingProgress: 'jt_reading_progress',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
