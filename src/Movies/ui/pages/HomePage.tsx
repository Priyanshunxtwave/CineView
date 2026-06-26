import { useState, useEffect, useCallback } from 'react';
import { tmdbService } from '../../data/tmdbService';
import { Movie, Genre } from '../../core/movieSchemas';
import { ContentRow } from '../components/ContentRow';
import { GenreFilter } from '../components/GenreFilter';
import { ErrorBoundary } from '../../../Common/ui/components/ErrorBoundary/ErrorBoundary';
import { HeroBanner } from '../components/HeroBanner';
type RowState = {
  data: Movie[];
  isLoading: boolean;
  error: string | null;
};

export const HomePage = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [activeGenreId, setActiveGenreId] = useState<number | null>(null);
  
  // Local state for each row
  const [popular, setPopular] = useState<RowState>({ data: [], isLoading: true, error: null });
  const [trending, setTrending] = useState<RowState>({ data: [], isLoading: true, error: null });

  // Fetch Genres
  useEffect(() => {
    tmdbService.getGenres('movie')
      .then(setGenres)
      .catch(err => console.error('Failed to fetch genres:', err));
  }, []);

  // Fetch Popular (wrapped in useCallback so we can pass it to onRetry)
  const fetchPopular = useCallback(async () => {
    setPopular(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await tmdbService.getPopularMovies();
      setPopular({ data, isLoading: false, error: null });
    } catch (err) {
      setPopular(prev => ({ ...prev, isLoading: false, error: err instanceof Error ? err.message : 'Unknown error occurred' }));
    }
  }, []);

  // Fetch Trending
  const fetchTrending = useCallback(async () => {
    setTrending(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await tmdbService.getTrending('movie', 'week');
      setTrending({ data, isLoading: false, error: null });
    } catch (err) {
      setTrending(prev => ({ ...prev, isLoading: false, error: err instanceof Error ? err.message : 'Unknown error occurred' }));
    }
  }, []);

  // Initial Data Load
  useEffect(() => {
    fetchPopular();
    fetchTrending();
  }, [fetchPopular, fetchTrending]);

  // Client-side filtering logic based on selected genre
  const filterMovies = (movies: Movie[]) => {
    if (!activeGenreId) return movies;
    return movies.filter(movie => movie.genre_ids.includes(activeGenreId));
  };

  return (
    <div className="pb-12">
      {/* Placeholder for HeroBanner (Will be added in next batch to keep file size manageable) */}
      {trending.data.length > 0 && (
        <HeroBanner 
          movie={trending.data[0]} 
          onTrailerClick={() => alert('Trailer modal coming in the next batch!')} 
        />
      )}

      <GenreFilter 
        genres={genres} 
        activeGenreId={activeGenreId} 
        onSelect={setActiveGenreId} 
      />

      <ErrorBoundary fallback={<div className="p-4 bg-red-900 text-white rounded">Critical failure rendering Popular row.</div>}>
        <ContentRow 
          title={activeGenreId ? "Filtered Popular Movies" : "Popular Movies"}
          items={filterMovies(popular.data)}
          isLoading={popular.isLoading}
          error={popular.error}
          onRetry={fetchPopular}
        />
      </ErrorBoundary>

      <ErrorBoundary fallback={<div className="p-4 bg-red-900 text-white rounded">Critical failure rendering Trending row.</div>}>
        <ContentRow 
          title={activeGenreId ? "Filtered Trending Movies" : "Trending This Week"}
          items={filterMovies(trending.data)}
          isLoading={trending.isLoading}
          error={trending.error}
          onRetry={fetchTrending}
        />
      </ErrorBoundary>
    </div>
  );
};