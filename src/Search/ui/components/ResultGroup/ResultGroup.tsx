import { Link } from 'react-router-dom';
import { SearchResult } from '../../../core/searchSchemas';
import { ImageWithFallback } from '../../../../Common/ui/components/ImageWithFallback/ImageWithFallback';

interface ResultGroupProps {
  title: string;
  items: SearchResult[];
}

const getLabel = (item: SearchResult) => item.title || item.name || 'Unknown';

const getImagePath = (item: SearchResult) =>
  item.media_type === 'person' ? item.profile_path : item.poster_path;

const getLink = (item: SearchResult): string | null => {
  if (item.media_type === 'movie') return `/movie/${item.id}`;
  if (item.media_type === 'tv') return `/tv/${item.id}`;
  return null; // people: no detail page yet
};

export const ResultGroup = ({ title, items }: ResultGroupProps) => {
  if (items.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                {items.map((item) => {
          const imagePath = getImagePath(item);
          const link = getLink(item);

          const card = (
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              <ImageWithFallback
                src={imagePath ? `https://image.tmdb.org/t/p/w500${imagePath}` : undefined}
                alt={getLabel(item)}
                className="h-64 w-full object-cover"
              />
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

              <h4 className="truncate text-sm font-bold text-slate-900 dark:text-white">{getLabel(item)}</h4>

                {item.vote_average !== undefined && item.media_type !== 'person' && (
                  <span className="text-xs text-yellow-500">★ {item.vote_average.toFixed(1)}</span>
                )}
              </div>
            </div>
          );

          return link ? (
            <Link key={`${item.media_type}-${item.id}`} to={link}>
              {card}
            </Link>
          ) : (
            <div key={`${item.media_type}-${item.id}`}>{card}</div>
          );
        })}
      </div>
    </section>
  );
};