import { Genre } from '../../core/movieSchemas';

interface GenreFilterProps {
  genres: Genre[];
  activeGenreId: number | null;
  onSelect: (id: number | null) => void;
}

const inactiveClass =
  'bg-slate-200 text-slate-800 hover:bg-slate-300 border border-slate-300 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white dark:border-slate-700/50';

const activeClass = 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25';

export const GenreFilter = ({ genres, activeGenreId, onSelect }: GenreFilterProps) => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="flex gap-3 overflow-x-auto py-6 scrollbar-hide">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
            activeGenreId === null ? activeClass : inactiveClass
          }`}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            type="button"
            onClick={() => onSelect(activeGenreId === genre.id ? null : genre.id)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeGenreId === genre.id ? activeClass : inactiveClass
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};