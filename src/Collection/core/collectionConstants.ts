export const WATCHLIST_STORAGE_KEY = 'cineview_watchlist';

export const WATCH_STATUS_LABELS = {
  want_to_watch: 'Want to Watch',
  watching: 'Watching',
  completed: 'Completed',
} as const;

export const WATCH_STATUS_ORDER = ['want_to_watch', 'watching', 'completed'] as const;