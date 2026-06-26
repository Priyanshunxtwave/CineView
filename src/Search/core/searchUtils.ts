import { SearchResult } from './searchSchemas';

export type GroupedSearchResults = {
  movies: SearchResult[];
  tvShows: SearchResult[];
  people: SearchResult[];
};

export const groupSearchResults = (results: SearchResult[]): GroupedSearchResults => ({
  movies: results.filter((r) => r.media_type === 'movie'),
  tvShows: results.filter((r) => r.media_type === 'tv'),
  people: results.filter((r) => r.media_type === 'person'),
});