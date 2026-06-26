import { CastMember } from '../../core/movieSchemas';
import { ImageWithFallback } from '../../../Common/ui/components/ImageWithFallback/ImageWithFallback';

interface CastCarouselProps {
  cast: CastMember[];
  isLoading: boolean;
}

export const CastCarousel = ({ cast, isLoading }: CastCarouselProps) => {
  if (isLoading) {
    return <div className="animate-pulse h-48 bg-gray-800 rounded-lg w-full my-8"></div>;
  }

  if (cast.length === 0) return null;

  return (
    <div className="my-8">
      <h3 className="text-xl font-bold text-white mb-4">Top Cast</h3>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {cast.map((actor) => (
          <div key={actor.id} className="flex-none w-32 bg-gray-900 rounded-lg overflow-hidden">
            <ImageWithFallback
              src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : undefined}
              alt={actor.name}
              fallbackText={actor.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-2">
              <p className="text-white text-sm font-bold truncate">{actor.name}</p>
              <p className="text-gray-400 text-xs truncate">{actor.character}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};