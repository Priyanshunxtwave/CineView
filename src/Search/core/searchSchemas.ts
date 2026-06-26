import { z } from 'zod';

export const SearchResultSchema = z.object({
  id: z.number(),
  media_type: z.enum(['movie', 'tv', 'person']),
  title: z.string().optional(), // For movies
  name: z.string().optional(),  // For TV and people
  poster_path: z.string().nullable().optional(),
  profile_path: z.string().nullable().optional(),
  vote_average: z.number().optional(),
});

export const SearchResponseSchema = z.object({
  results: z.array(SearchResultSchema),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;