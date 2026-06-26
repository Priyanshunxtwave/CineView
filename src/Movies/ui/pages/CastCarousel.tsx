import { CastMember } from '../../core/movieSchemas';
import { ImageWithFallback } from '../../../Common/ui/components/ImageWithFallback/ImageWithFallback';

interface CastCarouselProps {
  cast: CastMember[];
  isLoading: boolean;
}

export const CastCarousel = ({ cast, isLoading }: CastCarouselProps) => {
  if (isLoading) {
    return (
      <div className="animate-pulse h-48 bg-slate-200 dark:bg-gray-800 rounded-lg w-full my-8" />
    );
  }

  if (cast.length === 0) return null;

  return (
    <div className="my-8">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Top Cast</h3>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {cast.map((actor) => (
          <div
            key={actor.id}
            className="flex-none w-32 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-900"
          >
            <ImageWithFallback
              src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : undefined}
              alt={actor.name}
              fallbackText={actor.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-2">
              <p className="text-sm font-bold truncate text-slate-900 dark:text-white">
                {actor.name}
              </p>
              <p className="text-xs truncate text-slate-600 dark:text-gray-400">
                {actor.character}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};