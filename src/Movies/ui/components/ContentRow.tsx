import { Movie } from '../../core/movieSchemas';
import { MovieCard } from './MovieCard';

interface ContentRowProps {
  title: string;
  items: Movie[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const ContentRow = ({ title, items, isLoading, error, onRetry }: ContentRowProps) => {
  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 my-12">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6 tracking-wide">
          {title}
        </h2>
        <div className="p-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-red-700 dark:text-red-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-medium">Failed to load content.</span>
          <button
            type="button"
            onClick={onRetry}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-full text-sm font-bold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 my-12 overflow-hidden">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6 tracking-wide">
        {title}
      </h2>

      {isLoading ? (
        <div className="flex gap-4 md:gap-6 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex-none w-36 md:w-44 lg:w-52 aspect-2/3 bg-slate-200 dark:bg-slate-800/50 animate-pulse rounded-xl border border-slate-300 dark:border-slate-700/50"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
          No movies found in this category.
        </div>
      ) : (
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 pt-4 scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {items.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isInWatchlist={false}
              onToggleWatchlist={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};