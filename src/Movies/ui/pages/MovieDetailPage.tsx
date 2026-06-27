import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { reaction } from 'mobx';
import { preferencesStore } from '../../../Preferences';
import { tmdbService } from '../../data/tmdbService';
import { Movie, MovieDetail, CastMember } from '../../core/movieSchemas';
import { TrailerModal } from '../components/TrailerModal';
import { CastCarousel } from './CastCarousel';
import { ContentRow } from '../components/ContentRow';
import { ImageWithFallback } from '../../../Common/ui/components/ImageWithFallback/ImageWithFallback';
import { WatchlistActionButton, snapshotFromMovie } from '../../../Collection';

export const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const loadDetails = async () => {
      setIsLoading(true);
      try {
        const movieId = Number(id);
        const [movieData, castData, similarData, videos] = await Promise.all([
          tmdbService.getMovieDetail(movieId),
          tmdbService.getMovieCast(movieId),
          tmdbService.getSimilarMovies(movieId),
          tmdbService.getMovieVideos(movieId),
        ]);

        if (cancelled) return;

        setMovie(movieData);
        setCast(castData.slice(0, 10));
        setSimilar(similarData);

        const trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
        setVideoKey(trailer?.key ?? null);
      } catch (err) {
        console.error('Failed to load movie details', err);
        if (!cancelled) setMovie(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadDetails();

    const dispose = reaction(
      () => `${preferencesStore.language}-${preferencesStore.region}`,
      () => {
        void loadDetails();
      }
    );

    return () => {
      cancelled = true;
      dispose();
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-900 dark:text-white animate-pulse">
        Loading movie details...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="py-20 text-center text-red-500 dark:text-red-400">
        Movie not found.
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : undefined;

  return (
    <div className="pb-12 text-slate-900 dark:text-white">
      <div className="relative h-[60vh] w-full border-b border-slate-200 dark:border-gray-800 bg-slate-100 dark:bg-gray-900">
        <ImageWithFallback
          src={backdropUrl}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-100 via-slate-100/60 to-transparent dark:from-gray-900 dark:via-gray-900/60" />

        <div className="absolute bottom-0 left-0 w-full p-8 md:w-2/3">
          <h1 className="mb-4 text-4xl font-extrabold drop-shadow-lg md:text-6xl">{movie.title}</h1>
          <div className="mb-4 flex items-center space-x-4">
            <span className="rounded bg-yellow-500 px-2 py-1 text-sm font-bold text-black">
              ★ {movie.vote_average.toFixed(1)}
            </span>
            {movie.release_date && (
              <span className="text-slate-600 dark:text-gray-300">
                {movie.release_date.substring(0, 4)}
              </span>
            )}
          </div>
          <p className="mb-6 max-w-3xl text-lg text-slate-600 dark:text-gray-300 drop-shadow">
            {movie.overview}
          </p>

          <div className="flex flex-wrap gap-4">
            <WatchlistActionButton
              mediaType="movie"
              mediaId={movie.id}
              snapshot={snapshotFromMovie(movie)}
              variant="detail"
            />

            {videoKey && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="rounded-lg bg-blue-600 px-8 py-3 font-bold shadow-lg transition hover:bg-blue-500"
              >
                ▶ Watch Trailer
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-[1400px] px-8">
        <CastCarousel cast={cast} isLoading={false} />
        <ContentRow
          title="Similar Movies"
          items={similar}
          isLoading={false}
          error={null}
          onRetry={() => {}}
        />
      </div>

      <TrailerModal
        videoKey={videoKey}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};