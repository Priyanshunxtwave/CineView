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
      <div className="max-w-7xl mx-auto px-6 md:px-12 my-12">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 tracking-wide">{title}</h2>
        <div className="p-6 bg-red-950/30 border border-red-900/50 rounded-xl text-red-200 flex flex-col md:flex-row justify-between items-center gap-4 backdrop-blur-sm">
          <span className="font-medium">Failed to load content.</span>
          <button 
            onClick={onRetry} 
            className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-full text-sm font-bold transition-colors shadow-lg shadow-red-900/20"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 my-12 overflow-hidden">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6 tracking-wide">{title}</h2>
      
      {isLoading ? (
        <div className="flex gap-4 md:gap-6 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            // Skeletons now perfectly match the new MovieCard dimensions
            <div 
              key={i} 
              className="flex-none w-36 md:w-44 lg:w-52 aspect-2/3 bg-slate-800/50 animate-pulse rounded-xl border border-slate-700/50" 
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900/50 rounded-xl border border-slate-800 backdrop-blur-sm">
          No movies found in this category.
        </div>
      ) : (
        // The negative margin/padding trick allows smooth edge-to-edge scrolling
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 pt-4 scrollbar-hide -mx-6 px-6 md:-mx-12 md:px-12">
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