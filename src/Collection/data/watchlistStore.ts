import { makeAutoObservable } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import {
  MediaSnapshot,
  MediaType,
  WatchlistEntry,
  WatchStatus,
  WatchlistEntrySchema,
} from '../core/collectionSchemas';
import { collectionPersistence } from './collectionPersistence';

type AddEntryInput = {
  mediaId: number;
  mediaType: MediaType;
  snapshot: MediaSnapshot;
  status?: WatchStatus;
  note?: string;
};

class WatchlistStore {
  entries: WatchlistEntry[] = [];
  isInitialized = false;

  constructor() {
    makeAutoObservable(this);
  }

  init(): void {
    this.entries = collectionPersistence.load();
    this.isInitialized = true;
  }

  private mediaKey(mediaType: MediaType, mediaId: number): string {
    return `${mediaType}-${mediaId}`;
  }

  private persist(): void {
    collectionPersistence.save(this.entries);
  }

  get count(): number {
    return this.entries.length;
  }

  get countsByStatus(): Record<WatchStatus, number> {
    return {
      want_to_watch: this.entries.filter((e) => e.status === 'want_to_watch').length,
      watching: this.entries.filter((e) => e.status === 'watching').length,
      completed: this.entries.filter((e) => e.status === 'completed').length,
    };
  }

  findByMedia(mediaType: MediaType, mediaId: number): WatchlistEntry | undefined {
    const key = this.mediaKey(mediaType, mediaId);
    return this.entries.find((e) => this.mediaKey(e.mediaType, e.mediaId) === key);
  }

  isInWatchlist(mediaType: MediaType, mediaId: number): boolean {
    return Boolean(this.findByMedia(mediaType, mediaId));
  }

  add(input: AddEntryInput): void {
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
    if (!parsed.success) {
      console.error('Invalid watchlist entry', parsed.error);
      return;
    }

    this.entries = [parsed.data, ...this.entries];
    this.persist();
  }

  remove(id: string): void {
    this.entries = this.entries.filter((e) => e.id !== id);
    this.persist();
  }

  removeByMedia(mediaType: MediaType, mediaId: number): void {
    const entry = this.findByMedia(mediaType, mediaId);
    if (entry) this.remove(entry.id);
  }

  toggle(mediaType: MediaType, mediaId: number, snapshot: MediaSnapshot): void {
    if (this.isInWatchlist(mediaType, mediaId)) {
      this.removeByMedia(mediaType, mediaId);
    } else {
      this.add({ mediaId, mediaType, snapshot });
    }
  }

  updateStatus(id: string, status: WatchStatus): void {
    const entry = this.entries.find((e) => e.id === id);
    if (!entry) return;

    const updated: WatchlistEntry = {
      ...entry,
      status,
      updatedAt: new Date().toISOString(),
    };

    const parsed = WatchlistEntrySchema.safeParse(updated);
    if (!parsed.success) return;

    this.entries = this.entries.map((e) => (e.id === id ? parsed.data : e));
    this.persist();
  }

  updateNote(id: string, note: string): void {
    const trimmed = note.slice(0, 300);
    const entry = this.entries.find((e) => e.id === id);
    if (!entry) return;

    const updated: WatchlistEntry = {
      ...entry,
      note: trimmed,
      updatedAt: new Date().toISOString(),
    };

    const parsed = WatchlistEntrySchema.safeParse(updated);
    if (!parsed.success) return;

    this.entries = this.entries.map((e) => (e.id === id ? parsed.data : e));
    this.persist();
  }
}

export const watchlistStore = new WatchlistStore();