import { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { tmdbService } from '../../../Movies/data/tmdbService';
import { Episode } from '../../core/movieSchemas';

export const SeasonDetailPage = () => {
  const { seasonNum } = useParams();
  const { showId } = useOutletContext<{ showId: string }>();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!showId || !seasonNum) return;

    let cancelled = false;

    const loadSeason = async () => {
        setIsLoading(true);
        try {
          const data = await tmdbService.getSeasonDetail(Number(showId), Number(seasonNum));
          if (!cancelled) setEpisodes(data.episodes);
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      };

    loadSeason();
    return () => {
      cancelled = true;
    };
  }, [showId, seasonNum]);

  if (isLoading) {
    return <div className="py-8 text-center text-gray-500">Loading episodes...</div>;
  }

  if (episodes.length === 0) {
    return <div className="py-8 text-center text-gray-500">No episodes found for this season.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Season {seasonNum}</h2>
      {episodes.map((ep) => (
        <div key={ep.id} className="rounded bg-gray-900 p-4">
          <h3 className="font-bold">
            {ep.episode_number}. {ep.name}
          </h3>
          <p className="text-sm text-gray-400">{ep.overview}</p>
        </div>
      ))}
    </div>
  );
};