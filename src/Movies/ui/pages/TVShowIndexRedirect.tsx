import { Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { tmdbService } from '../../data/tmdbService';

export const TVShowIndexRedirect = () => {
  const { id } = useParams();
  const [seasonNum, setSeasonNum] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      const show = await tmdbService.getTVShowDetail(Number(id));
      const first = show.seasons.find((s) => s.season_number > 0);
      if (!cancelled && first) setSeasonNum(first.season_number);
    };

    load();
    return () => { cancelled = true; };
  }, [id]);

  if (seasonNum === null) return <div className="text-white">Loading season...</div>;
  return <Navigate to={`season/${seasonNum}`} replace />;
};