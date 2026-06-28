import { z } from 'zod';
import { COLLECTION_VERSION, MAX_LIST_DESCRIPTION_LENGTH, MAX_LIST_NAME_LENGTH, MAX_NOTE_LENGTH } from './collectionConstants';

export const WatchStatusSchema = z.enum(['want_to_watch', 'watching', 'completed']);
export const MediaTypeSchema = z.enum(['movie', 'tv']);

export const MediaSnapshotSchema = z.object({
  title: z.string(),
  posterPath: z.string().nullable(),
  voteAverage: z.number().optional(),
  totalEpisodes: z.number().optional(),  // ← add this line

});

export const WatchlistEntrySchema = z.object({
  id: z.string().uuid(),
  mediaId: z.number(),
  mediaType: MediaTypeSchema,
  status: WatchStatusSchema,
  note: z.string().max(MAX_NOTE_LENGTH),
  snapshot: MediaSnapshotSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CustomListItemSchema = z.object({
  id: z.string().uuid(),
  mediaId: z.number(),
  mediaType: MediaTypeSchema,
  snapshot: MediaSnapshotSchema,
  addedAt: z.string(),
});

export const CustomListSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(MAX_LIST_NAME_LENGTH),
  description: z.string().max(MAX_LIST_DESCRIPTION_LENGTH).optional(),
  items: z.array(CustomListItemSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const EpisodeProgressSchema = z.object({
  showId: z.number(),
  seasonNumber: z.number(),
  episodeNumber: z.number(),
  watchedAt: z.string(),
});

export const CollectionStorageSchema = z.object({
  version: z.literal(COLLECTION_VERSION),
  watchlist: z.array(WatchlistEntrySchema),
  customLists: z.array(CustomListSchema),
  episodeProgress: z.array(EpisodeProgressSchema),
});

// Legacy M5 schema for migration
export const LegacyWatchlistStorageSchema = z.object({
  entries: z.array(WatchlistEntrySchema),
});

export type WatchStatus = z.infer<typeof WatchStatusSchema>;
export type MediaType = z.infer<typeof MediaTypeSchema>;
export type MediaSnapshot = z.infer<typeof MediaSnapshotSchema>;
export type WatchlistEntry = z.infer<typeof WatchlistEntrySchema>;
export type CustomListItem = z.infer<typeof CustomListItemSchema>;
export type CustomList = z.infer<typeof CustomListSchema>;
export type EpisodeProgress = z.infer<typeof EpisodeProgressSchema>;
export type CollectionStorage = z.infer<typeof CollectionStorageSchema>;