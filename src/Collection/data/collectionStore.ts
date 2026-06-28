import { makeAutoObservable } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import {
  CustomList,
  CustomListSchema,
  EpisodeProgress,
  MediaSnapshot,
  MediaType,
  WatchlistEntry,
  WatchlistEntrySchema,
  WatchStatus,
} from '../core/collectionSchemas';

import { collectionPersistence } from './collectionPersistence';

type AddWatchlistInput = {
  mediaId: number;
  mediaType: MediaType;
  snapshot: MediaSnapshot;
  status?: WatchStatus;
  note?: string;
};

type CreateListInput = {
  name: string;
  description?: string;
};

class CollectionStore {
  watchlist: WatchlistEntry[] = [];
  customLists: CustomList[] = [];
  episodeProgress: EpisodeProgress[] = [];
  isInitialized = false;

  constructor() {
    makeAutoObservable(this);
  }

  init(): void {
    const state = collectionPersistence.load();
    this.watchlist = state.watchlist;
    this.customLists = state.customLists;
    this.episodeProgress = state.episodeProgress;
    this.isInitialized = true;
    this.persist();
  }

  private mediaKey(mediaType: MediaType, mediaId: number): string {
    return `${mediaType}-${mediaId}`;
  }

  private persist(): void {
    collectionPersistence.save({
      version: 2,
      watchlist: this.watchlist,
      customLists: this.customLists,
      episodeProgress: this.episodeProgress,
    });
  }

  // ─── Watchlist computed ───────────────────────────────────────

  get count(): number {
    return this.watchlist.length;
  }

  get countsByStatus(): Record<WatchStatus, number> {
    return {
      want_to_watch: this.watchlist.filter((e) => e.status === 'want_to_watch').length,
      watching: this.watchlist.filter((e) => e.status === 'watching').length,
      completed: this.watchlist.filter((e) => e.status === 'completed').length,
    };
  }

  findWatchlistByMedia(mediaType: MediaType, mediaId: number): WatchlistEntry | undefined {
    const key = this.mediaKey(mediaType, mediaId);
    return this.watchlist.find((e) => this.mediaKey(e.mediaType, e.mediaId) === key);
  }

  isInWatchlist(mediaType: MediaType, mediaId: number): boolean {
    return Boolean(this.findWatchlistByMedia(mediaType, mediaId));
  }

  hasWatchlistNote(mediaType: MediaType, mediaId: number): boolean {
    const entry = this.findWatchlistByMedia(mediaType, mediaId);
    return Boolean(entry?.note.trim());
  }

  // ─── Watchlist actions ────────────────────────────────────────

  addToWatchlist(input: AddWatchlistInput): void {
    if (this.isInWatchlist(input.mediaType, input.mediaId)) return;

    const now = new Date().toISOString();
    const candidate: WatchlistEntry = {
      id: uuidv4(),
      mediaId: input.mediaId,
      mediaType: input.mediaType,
      status: input.status ?? 'want_to_watch',
      note: input.note ?? '',
      snapshot: input.snapshot,
      createdAt: now,
      updatedAt: now,
    };

    const parsed = WatchlistEntrySchema.safeParse(candidate);
    if (!parsed.success) return;

    this.watchlist = [parsed.data, ...this.watchlist];
    this.persist();
  }

  removeFromWatchlist(id: string): void {
    const entry = this.watchlist.find((e) => e.id === id);
    if (!entry) return;

    this.watchlist = this.watchlist.filter((e) => e.id !== id);

    // M6: also remove episode progress + notes (note lives on entry, so it's gone)
    if (entry.mediaType === 'tv') {
      this.episodeProgress = this.episodeProgress.filter((p) => p.showId !== entry.mediaId);
    }

    this.persist();
  }

  removeWatchlistByMedia(mediaType: MediaType, mediaId: number): void {
    const entry = this.findWatchlistByMedia(mediaType, mediaId);
    if (entry) this.removeFromWatchlist(entry.id);
  }

  toggleWatchlist(mediaType: MediaType, mediaId: number, snapshot: MediaSnapshot): void {
    if (this.isInWatchlist(mediaType, mediaId)) {
      this.removeWatchlistByMedia(mediaType, mediaId);
    } else {
      this.addToWatchlist({ mediaId, mediaType, snapshot });
    }
  }

  updateWatchlistStatus(id: string, status: WatchStatus): void {
    const entry = this.watchlist.find((e) => e.id === id);
    if (!entry) return;

    const updated: WatchlistEntry = {
      ...entry,
      status,
      updatedAt: new Date().toISOString(),
    };

    const parsed = WatchlistEntrySchema.safeParse(updated);
    if (!parsed.success) return;

    this.watchlist = this.watchlist.map((e) => (e.id === id ? parsed.data : e));
    this.persist();
  }

  updateWatchlistNote(id: string, note: string): void {
    const entry = this.watchlist.find((e) => e.id === id);
    if (!entry) return;

    const updated: WatchlistEntry = {
      ...entry,
      note: note.slice(0, 300),
      updatedAt: new Date().toISOString(),
    };

    const parsed = WatchlistEntrySchema.safeParse(updated);
    if (!parsed.success) return;

    this.watchlist = this.watchlist.map((e) => (e.id === id ? parsed.data : e));
    this.persist();
  }

  clearWatchlistNote(id: string): void {
    this.updateWatchlistNote(id, '');
  }

  // ─── Custom lists ─────────────────────────────────────────────

  getListById(listId: string): CustomList | undefined {
    return this.customLists.find((l) => l.id === listId);
  }

  isInList(listId: string, mediaType: MediaType, mediaId: number): boolean {
    const list = this.getListById(listId);
    if (!list) return false;
    const key = this.mediaKey(mediaType, mediaId);
    return list.items.some((item) => this.mediaKey(item.mediaType, item.mediaId) === key);
  }

  createList(input: CreateListInput): CustomList | null {
    const now = new Date().toISOString();
    const candidate: CustomList = {
      id: uuidv4(),
      name: input.name.trim().slice(0, 60),
      ...(input.description?.trim()
        ? { description: input.description.trim().slice(0, 200) }
        : {}),
      items: [],
      createdAt: now,
      updatedAt: now,
    };

    const parsed = CustomListSchema.safeParse(candidate);
    if (!parsed.success) return null;

    this.customLists = [parsed.data, ...this.customLists];
    this.persist();
    return parsed.data;
  }

  renameList(listId: string, name: string): void {
    const list = this.getListById(listId);
    if (!list) return;

    const updated: CustomList = {
      ...list,
      name: name.trim().slice(0, 60),
      updatedAt: new Date().toISOString(),
    };

    const parsed = CustomListSchema.safeParse(updated);
    if (!parsed.success) return;

    this.customLists = this.customLists.map((l) => (l.id === listId ? parsed.data : l));
    this.persist();
  }

  deleteList(listId: string): void {
    this.customLists = this.customLists.filter((l) => l.id !== listId);
    this.persist();
  }

  toggleListItem(
    listId: string,
    mediaType: MediaType,
    mediaId: number,
    snapshot: MediaSnapshot
  ): void {
    const list = this.getListById(listId);
    if (!list) return;

    const key = this.mediaKey(mediaType, mediaId);
    const exists = list.items.some((item) => this.mediaKey(item.mediaType, item.mediaId) === key);

    const updatedItems = exists
      ? list.items.filter((item) => this.mediaKey(item.mediaType, item.mediaId) !== key)
      : [
          {
            id: uuidv4(),
            mediaId,
            mediaType,
            snapshot,
            addedAt: new Date().toISOString(),
          },
          ...list.items,
        ];

    const updated: CustomList = {
      ...list,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    };

    const parsed = CustomListSchema.safeParse(updated);
    if (!parsed.success) return;

    this.customLists = this.customLists.map((l) => (l.id === listId ? parsed.data : l));
    this.persist();
  }

  removeListItem(listId: string, itemId: string): void {
    const list = this.getListById(listId);
    if (!list) return;

    const updated: CustomList = {
      ...list,
      items: list.items.filter((item) => item.id !== itemId),
      updatedAt: new Date().toISOString(),
    };

    const parsed = CustomListSchema.safeParse(updated);
    if (!parsed.success) return;

    this.customLists = this.customLists.map((l) => (l.id === listId ? parsed.data : l));
    this.persist();
  }

  // ─── Episode progress ─────────────────────────────────────────

  isEpisodeWatched(showId: number, seasonNumber: number, episodeNumber: number): boolean {
    return this.episodeProgress.some(
      (p) =>
        p.showId === showId &&
        p.seasonNumber === seasonNumber &&
        p.episodeNumber === episodeNumber
    );
  }

  toggleEpisode(showId: number, seasonNumber: number, episodeNumber: number): void {
    const exists = this.isEpisodeWatched(showId, seasonNumber, episodeNumber);

    this.episodeProgress = exists
      ? this.episodeProgress.filter(
          (p) =>
            !(
              p.showId === showId &&
              p.seasonNumber === seasonNumber &&
              p.episodeNumber === episodeNumber
            )
        )
      : [
          ...this.episodeProgress,
          {
            showId,
            seasonNumber,
            episodeNumber,
            watchedAt: new Date().toISOString(),
          },
        ];

    this.persist();
  }

  markAllEpisodes(showId: number, seasonNumber: number, episodeNumbers: number[]): void {
    const existing = new Set(
      this.episodeProgress
        .filter((p) => p.showId === showId && p.seasonNumber === seasonNumber)
        .map((p) => p.episodeNumber)
    );

    const now = new Date().toISOString();
    const toAdd = episodeNumbers
      .filter((num) => !existing.has(num))
      .map((episodeNumber) => ({
        showId,
        seasonNumber,
        episodeNumber,
        watchedAt: now,
      }));

    this.episodeProgress = [...this.episodeProgress, ...toAdd];
    this.persist();
  }

  unmarkAllEpisodes(showId: number, seasonNumber: number): void {
    this.episodeProgress = this.episodeProgress.filter(
      (p) => !(p.showId === showId && p.seasonNumber === seasonNumber)
    );
    this.persist();
  }

  getSeasonProgress(
    showId: number,
    seasonNumber: number,
    totalEpisodes: number
  ): { watched: number; total: number } {
    const watched = this.episodeProgress.filter(
      (p) => p.showId === showId && p.seasonNumber === seasonNumber
    ).length;
    return { watched, total: totalEpisodes };
  }

  getShowProgress(
    showId: number,
    seasons: { seasonNumber: number; episodeCount: number }[]
  ): { watched: number; total: number } {
    const total = seasons.reduce((sum, s) => sum + s.episodeCount, 0);
    const watched = this.episodeProgress.filter((p) => p.showId === showId).length;
    return { watched, total };
  }
}

export const collectionStore = new CollectionStore();

// Back-compat alias while you update imports
export const watchlistStore = collectionStore;