import { z } from 'zod';
import { SearchResponseSchema, SearchResult } from '../../Search/core/searchSchemas';
import {
  Movie,
  Genre,
  MovieListResponseSchema,
  GenreListResponseSchema,
  MovieDetailSchema,
  MovieDetail,
  CreditsResponseSchema,
  CastMember,
  VideosResponseSchema,
  Video,
  TVShowDetailSchema,
  TVShowDetail,
  SeasonDetailSchema,
  SeasonDetail,
} from '../core/movieSchemas';

class TmdbApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TmdbApiError';
  }
}

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const fetchFromTmdb = async <T>(endpoint: string, schema: z.ZodSchema<T>): Promise<T> => {
  if (!API_KEY) throw new TmdbApiError('TMDB API key is missing.');

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', API_KEY);
  url.searchParams.append('language', 'en-US');

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new TmdbApiError(`TMDB API responded with status: ${response.status}`);
  }

  const data = await response.json();
  const validation = schema.safeParse(data);

  if (!validation.success) {
    console.error('TMDB Schema Validation Failed:', validation.error);
    throw new TmdbApiError('Invalid data received from TMDB.');
  }

  return validation.data;
};

export const tmdbService = {
  getTrending: async (
    mediaType: 'movie' | 'tv' = 'movie',
    window: 'day' | 'week' = 'day'
  ): Promise<Movie[]> => {
    const data = await fetchFromTmdb(`/trending/${mediaType}/${window}`, MovieListResponseSchema);
    return data.results;
  },

  search: async (query: string): Promise<SearchResult[]> => {
    const data = await fetchFromTmdb(
      `/search/multi?query=${encodeURIComponent(query)}`,
      SearchResponseSchema
    );
    return data.results;
  },

  getMovieDetail: async (id: number): Promise<MovieDetail> => {
    return fetchFromTmdb(`/movie/${id}`, MovieDetailSchema);
  },

  getMovieVideos: async (id: number): Promise<Video[]> => {
    const data = await fetchFromTmdb(`/movie/${id}/videos`, VideosResponseSchema);
    return data.results;
  },

  getMovieCast: async (id: number): Promise<CastMember[]> => {
    const data = await fetchFromTmdb(`/movie/${id}/credits`, CreditsResponseSchema);
    return data.cast;
  },

  getSimilarMovies: async (id: number): Promise<Movie[]> => {
    const data = await fetchFromTmdb(`/movie/${id}/similar`, MovieListResponseSchema);
    return data.results;
  },

  getTVShowDetail: async (id: number): Promise<TVShowDetail> => {
    return fetchFromTmdb(`/tv/${id}`, TVShowDetailSchema);
  },

  getSeasonDetail: async (showId: number, seasonNumber: number): Promise<SeasonDetail> => {
    return fetchFromTmdb(`/tv/${showId}/season/${seasonNumber}`, SeasonDetailSchema);
  },

  getPopularMovies: async (): Promise<Movie[]> => {
    const data = await fetchFromTmdb('/movie/popular', MovieListResponseSchema);
    return data.results;
  },

  getGenres: async (mediaType: 'movie' | 'tv' = 'movie'): Promise<Genre[]> => {
    const data = await fetchFromTmdb(`/genre/${mediaType}/list`, GenreListResponseSchema);
    return data.genres;
  },
};