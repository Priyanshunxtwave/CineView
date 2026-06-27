import { WATCHLIST_STORAGE_KEY } from '../core/collectionConstants';
import {
  WatchlistEntry,
  WatchlistStorageSchema,
} from '../core/collectionSchemas';

export const collectionPersistence = {
  load(): WatchlistEntry[] {
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      const result = WatchlistStorageSchema.safeParse(parsed);
      if (result.success) return result.data.entries;

      localStorage.removeItem(WATCHLIST_STORAGE_KEY);
      return [];
    } catch {
      localStorage.removeItem(WATCHLIST_STORAGE_KEY);
      return [];
    }
  },

  save(entries: WatchlistEntry[]): void {
    const payload = { entries };
    const validated = WatchlistStorageSchema.safeParse(payload);
    if (!validated.success) {
      console.error('Refusing to persist invalid watchlist data', validated.error);
      return;
    }
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(validated.data));
  },
};