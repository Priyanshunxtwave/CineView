import { Movie } from '../../core/movieSchemas';
import { ImageWithFallback } from '../../../Common/ui/components/ImageWithFallback/ImageWithFallback';
import {
  WatchlistActionButton,
  AddToListPopover,
  snapshotFromMovie,
} from '../../../Collection';

interface HeroBannerProps {
  movie: Movie;
  onTrailerClick?: () => void;
}

export const HeroBanner = ({ movie, onTrailerClick }: HeroBannerProps) => {
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : undefined;

  const snapshot = snapshotFromMovie(movie);

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] flex items-end pb-16">
      <div className="absolute inset-0 w-full h-full">
        <ImageWithFallback
          src={backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/50 to-transparent" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
          {movie.title}
        </h1>

        <div className="flex items-center space-x-4 mb-6 text-sm font-medium">
          <span className="px-2.5 py-0.5 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 rounded">
            ★ {movie.vote_average.toFixed(1)}
          </span>
          <span className="text-slate-300">
            {movie.release_date ? movie.release_date.substring(0, 4) : 'Unknown Year'}
          </span>
        </div>

        <p className="text-slate-300 text-sm md:text-base line-clamp-3 mb-8 max-w-2xl leading-relaxed">
          {movie.overview}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          {onTrailerClick && (
            <button
              type="button"
              onClick={onTrailerClick}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-full transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center gap-2"
            >
              ▶ Watch Trailer
            </button>
          )}

          <WatchlistActionButton
            mediaType="movie"
            mediaId={movie.id}
            snapshot={snapshot}
            variant="banner"
          />

          <AddToListPopover
            mediaType="movie"
            mediaId={movie.id}
            snapshot={snapshot}
            variant="detail"
          />
        </div>
      </div>
    </div>
  );
};