import { useState, useEffect, useCallback } from 'react';
import { reaction } from 'mobx';
import { preferencesStore } from '../../../Preferences';
import { tmdbService } from '../../data/tmdbService';
import { Movie, Genre } from '../../core/movieSchemas';
import { ContentRow } from '../components/ContentRow';
import { GenreFilter } from '../components/GenreFilter';
import { ErrorBoundary } from '../../../Common/ui/components/ErrorBoundary/ErrorBoundary';
import { HeroBanner } from '../components/HeroBanner';
import { TrailerModal } from '../components/TrailerModal';

type RowState = {
  data: Movie[];
  isLoading: boolean;
  error: string | null;
};

export const HomePage = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [activeGenreId, setActiveGenreId] = useState<number | null>(null);
  const [popular, setPopular] = useState<RowState>({ data: [], isLoading: true, error: null });
  const [trending, setTrending] = useState<RowState>({ data: [], isLoading: true, error: null });
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const heroMovie = trending.data[0] ?? null;
  const heroMovieId = heroMovie?.id;

  const fetchGenres = useCallback(async () => {
    try {
      const data = await tmdbService.getGenres('movie');
      setGenres(data);
    } catch (err) {
      console.error('Failed to fetch genres:', err);
    }
  }, []);

  const fetchPopular = useCallback(async () => {
    setPopular((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await tmdbService.getPopularMovies();
      setPopular({ data, isLoading: false, error: null });
    } catch (err) {
      setPopular((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred',
      }));
    }
  }, []);

  const fetchTrending = useCallback(async () => {
    setTrending((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await tmdbService.getTrending('movie', 'week');
      setTrending({ data, isLoading: false, error: null });
    } catch (err) {
      setTrending((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred',
      }));
    }
  }, []);

  const loadAll = useCallback(async () => {
    await Promise.all([fetchGenres(), fetchPopular(), fetchTrending()]);
  }, [fetchGenres, fetchPopular, fetchTrending]);

  useEffect(() => {
    const run = async () => {
      await loadAll();
    };

    void run();

    const dispose = reaction(
      () => `${preferencesStore.language}-${preferencesStore.region}`,
      () => {
        void run();
      }
    );

    return () => {
      dispose();
    };
  }, [loadAll]);

  useEffect(() => {
    if (!heroMovieId) return;

    let cancelled = false;

    const loadTrailer = async () => {
      try {
        const videos = await tmdbService.getMovieVideos(heroMovieId);
        const trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
        if (!cancelled) setVideoKey(trailer?.key ?? null);
      } catch (err) {
        console.error('Failed to fetch trailer', err);
        if (!cancelled) setVideoKey(null);
      }
    };

    void loadTrailer();

    return () => {
      cancelled = true;
    };
  }, [heroMovieId]);

  const filterMovies = (movies: Movie[]) => {
    if (!activeGenreId) return movies;
    return movies.filter((movie) => movie.genre_ids.includes(activeGenreId));
  };

  return (
    <div className="pb-12">
      {heroMovie && (
        <HeroBanner
          movie={heroMovie}
          {...(videoKey ? { onTrailerClick: () => setIsModalOpen(true) } : {})}
        />
      )}

      <GenreFilter genres={genres} activeGenreId={activeGenreId} onSelect={setActiveGenreId} />

      <ErrorBoundary fallback={<div className="p-4 bg-red-900 text-white rounded">Critical failure rendering Popular row.</div>}>
        <ContentRow
          title={activeGenreId ? 'Filtered Popular Movies' : 'Popular Movies'}
          items={filterMovies(popular.data)}
          isLoading={popular.isLoading}
          error={popular.error}
          onRetry={fetchPopular}
        />
      </ErrorBoundary>

      <ErrorBoundary fallback={<div className="p-4 bg-red-900 text-white rounded">Critical failure rendering Trending row.</div>}>
        <ContentRow
          title={activeGenreId ? 'Filtered Trending Movies' : 'Trending This Week'}
          items={filterMovies(trending.data)}
          isLoading={trending.isLoading}
          error={trending.error}
          onRetry={fetchTrending}
        />
      </ErrorBoundary>

      <TrailerModal
        videoKey={videoKey}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};