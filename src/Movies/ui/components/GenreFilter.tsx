import { Genre } from '../../core/movieSchemas';

interface GenreFilterProps {
  genres: Genre[];
  activeGenreId: number | null;
  onSelect: (id: number | null) => void;
}

export const GenreFilter = ({ genres, activeGenreId, onSelect }: GenreFilterProps) => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="flex gap-3 overflow-x-auto py-6 scrollbar-hide">
        <button
          onClick={() => onSelect(null)}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
            activeGenreId === null 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
          }`}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onSelect(activeGenreId === genre.id ? null : genre.id)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeGenreId === genre.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};