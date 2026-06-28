import { Movie } from '../../Movies/core/movieSchemas';
import { TVShowDetail } from '../../Movies/core/movieSchemas';
import { SearchResult } from '../../Search/core/searchSchemas';
import { MediaSnapshot, MediaType } from './collectionSchemas';
import { EpisodeProgress } from './collectionSchemas';

export const episodeKey = (showId: number, seasonNumber: number, episodeNumber: number): string =>
  `${showId}-s${seasonNumber}-e${episodeNumber}`;

export const parseEpisodeKey = (key: string): EpisodeProgress | null => {
  const match = key.match(/^(\d+)-s(\d+)-e(\d+)$/);
  if (!match) return null;
  return {
    showId: Number(match[1]),
    seasonNumber: Number(match[2]),
    episodeNumber: Number(match[3]),
    watchedAt: new Date().toISOString(),
  };
};
export const getProgressPercent = (watched: number, total: number): number =>
  total === 0 ? 0 : Math.round((watched / total) * 100);

export const snapshotFromMovie = (movie: Movie): MediaSnapshot => ({
  title: movie.title,
  posterPath: movie.poster_path,
  voteAverage: movie.vote_average,
});

export const snapshotFromTVShow = (show: TVShowDetail): MediaSnapshot => ({
  title: show.name,
  posterPath: show.poster_path ?? null,
  ...(show.vote_average !== undefined ? { voteAverage: show.vote_average } : {}),
  totalEpisodes: show.seasons
    .filter((s) => s.season_number > 0)
    .reduce((sum, s) => sum + s.episode_count, 0),
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