import { z } from 'zod';

export const GenreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const MovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  overview: z.string(),
  release_date: z.string().default(''),
  vote_average: z.number(),
  genre_ids: z.array(z.number()).default([]),
});

export const MovieListResponseSchema = z.object({
  results: z.array(MovieSchema),
  page: z.number(),
  total_pages: z.number(),
});

export const GenreListResponseSchema = z.object({
  genres: z.array(GenreSchema),
});

// Extracted Types
export type Genre = z.infer<typeof GenreSchema>;
export type Movie = z.infer<typeof MovieSchema>;
export const CastMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
});

export const CreditsResponseSchema = z.object({
  cast: z.array(CastMemberSchema),
});

export const VideoSchema = z.object({
  key: z.string(),
  site: z.string(),
  type: z.string(),
});
export const SeasonSummarySchema = z.object({
  id: z.number(),
  season_number: z.number(),
  name: z.string(),
  episode_count: z.number(),
  poster_path: z.string().nullable().optional(),
});

export const VideosResponseSchema = z.object({
  results: z.array(VideoSchema),
});

export const MovieDetailSchema = MovieSchema.extend({
  runtime: z.number().nullable().optional(),
  genres: z.array(GenreSchema).optional(),
});

export const EpisodeSchema = z.object({
  id: z.number(),
  episode_number: z.number(),
  name: z.string(),
  overview: z.string(),
  air_date: z.string().optional(),
  still_path: z.string().nullable().optional(),
});

export const SeasonDetailSchema = z.object({
  episodes: z.array(EpisodeSchema),
});

export const TVShowDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable().optional(),
  backdrop_path: z.string().nullable().optional(),
  vote_average: z.number().optional(),
  number_of_seasons: z.number().optional(),
  first_air_date: z.string().optional(),
  seasons: z.array(SeasonSummarySchema).default([]),
});

export type CastMember = z.infer<typeof CastMemberSchema>;
export type Video = z.infer<typeof VideoSchema>;
export type MovieDetail = z.infer<typeof MovieDetailSchema>;
export type Episode = z.infer<typeof EpisodeSchema>;
export type SeasonDetail = z.infer<typeof SeasonDetailSchema>;
export type TVShowDetail = z.infer<typeof TVShowDetailSchema>;
export type SeasonSummary = z.infer<typeof SeasonSummarySchema>;
