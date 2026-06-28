import {
  COLLECTION_STORAGE_KEY,
  COLLECTION_VERSION,
  LEGACY_WATCHLIST_STORAGE_KEY,
} from '../core/collectionConstants';
import {
  CollectionStorage,
  CollectionStorageSchema,
  LegacyWatchlistStorageSchema,
} from '../core/collectionSchemas';

const EMPTY_STATE: CollectionStorage = {
  version: COLLECTION_VERSION,
  watchlist: [],
  customLists: [],
  episodeProgress: [],
};

export const collectionPersistence = {
  load(): CollectionStorage {
    const raw = localStorage.getItem(COLLECTION_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const result = CollectionStorageSchema.safeParse(parsed);
        if (result.success) return result.data;
      } catch {
        // fall through to migration / reset
      }
    }

    // Migrate from M5 watchlist key
    const legacyRaw = localStorage.getItem(LEGACY_WATCHLIST_STORAGE_KEY);
    if (legacyRaw) {
      try {
        const legacyParsed = JSON.parse(legacyRaw);
        const legacy = LegacyWatchlistStorageSchema.safeParse(legacyParsed);
        if (legacy.success) {
          return {
            version: COLLECTION_VERSION,
            watchlist: legacy.data.entries,
            customLists: [],
            episodeProgress: [],
          };
        }
      } catch {
        // ignore
      }
    }

    return EMPTY_STATE;
  },

  save(state: CollectionStorage): void {
    const validated = CollectionStorageSchema.safeParse(state);
    if (!validated.success) {
      console.error('Refusing to persist invalid collection data', validated.error);
      return;
    }
    localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(validated.data));
    // Clean up legacy key after first successful save
    localStorage.removeItem(LEGACY_WATCHLIST_STORAGE_KEY);
  },
};