import { Movie } from '../../Movies/core/movieSchemas';
import { TVShowDetail } from '../../Movies/core/movieSchemas';
import { SearchResult } from '../../Search/core/searchSchemas';
import { MediaSnapshot, MediaType } from './collectionSchemas';

export const snapshotFromMovie = (movie: Movie): MediaSnapshot => ({
  title: movie.title,
  posterPath: movie.poster_path,
  voteAverage: movie.vote_average,
});

export const snapshotFromTVShow = (show: TVShowDetail): MediaSnapshot => ({
  title: show.name,
  posterPath: show.poster_path ?? null,
  ...(show.vote_average !== undefined ? { voteAverage: show.vote_average } : {}),
});

export const snapshotFromSearchResult = (
  item: SearchResult
): { mediaType: MediaType; snapshot: MediaSnapshot } | null => {
  if (item.media_type === 'person') return null;

  const title = item.title ?? item.name ?? 'Unknown';
  const snapshot: MediaSnapshot = {
    title,
    posterPath: item.poster_path ?? null,
    ...(item.vote_average !== undefined ? { voteAverage: item.vote_average } : {}),
  };

  return { mediaType: item.media_type, snapshot };
};

export const mediaDetailPath = (mediaType: MediaType, mediaId: number): string =>
  mediaType === 'movie' ? `/movie/${mediaId}` : `/tv/${mediaId}`;