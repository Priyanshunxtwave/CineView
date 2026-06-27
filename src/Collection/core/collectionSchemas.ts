import { z } from 'zod';

export const WatchStatusSchema = z.enum(['want_to_watch', 'watching', 'completed']);
export const MediaTypeSchema = z.enum(['movie', 'tv']);

export const MediaSnapshotSchema = z.object({
  title: z.string(),
  posterPath: z.string().nullable(),
  voteAverage: z.number().optional(),
});

export const WatchlistEntrySchema = z.object({
  id: z.string().uuid(),
  mediaId: z.number(),
  mediaType: MediaTypeSchema,
  status: WatchStatusSchema,
  note: z.string().max(300),
  snapshot: MediaSnapshotSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const WatchlistStorageSchema = z.object({
  entries: z.array(WatchlistEntrySchema),
});

export type WatchStatus = z.infer<typeof WatchStatusSchema>;
export type MediaType = z.infer<typeof MediaTypeSchema>;
export type MediaSnapshot = z.infer<typeof MediaSnapshotSchema>;
export type WatchlistEntry = z.infer<typeof WatchlistEntrySchema>;
export type WatchlistStorage = z.infer<typeof WatchlistStorageSchema>;