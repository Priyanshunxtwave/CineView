import { Link } from 'react-router-dom';
import { Movie } from '../../core/movieSchemas';
import { ImageWithFallback } from '../../../Common/ui/components/ImageWithFallback/ImageWithFallback';
import {
  AddToListPopover,
  snapshotFromMovie,
  mediaDetailPath,
  type MediaType,
} from '../../../Collection';

interface MovieCardProps {
  movie: Movie;
  mediaType?: MediaType;
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
}

export const MovieCard = ({
  movie,
  mediaType = 'movie',
  isInWatchlist,
  onToggleWatchlist,
}: MovieCardProps) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : undefined;

  const snapshot = snapshotFromMovie(movie);

  return (
    <Link
      to={mediaDetailPath(mediaType, movie.id)}
      className="group relative w-36 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-transform duration-300 hover:-translate-y-1 hover:border-slate-400 dark:hover:border-slate-700 hover:shadow-lg md:w-44 lg:w-52"
    >
      <div className="aspect-2/3 w-full">
        <ImageWithFallback
          src={imageUrl}
          alt={movie.title}
          fallbackText={movie.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="mb-1 truncate text-sm font-bold text-white md:text-base">{movie.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-yellow-500">
            ★ {movie.vote_average.toFixed(1)}
          </span>

          <div className="flex items-center gap-2">
            <AddToListPopover
              mediaType={mediaType}
              mediaId={movie.id}
              snapshot={snapshot}
              variant="card"
            />

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleWatchlist();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 text-white backdrop-blur-sm transition-colors hover:bg-indigo-600"
            >
              {isInWatchlist ? '✓' : '+'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};