export const COLLECTION_STORAGE_KEY = 'cineview_collection';
export const LEGACY_WATCHLIST_STORAGE_KEY = 'cineview_watchlist'; // M5 key — migrate then ignore

export const COLLECTION_VERSION = 2;

export const MAX_NOTE_LENGTH = 300;
export const MAX_LIST_NAME_LENGTH = 60;
export const MAX_LIST_DESCRIPTION_LENGTH = 200;

export const WATCH_STATUS_LABELS = {
  want_to_watch: 'Want to Watch',
  watching: 'Watching',
  completed: 'Completed',
} as const;

export const WATCH_STATUS_ORDER = ['want_to_watch', 'watching', 'completed'] as const;

export const NOTE_WARNING_THRESHOLD = 280; // show warning color near limit