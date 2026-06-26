import { Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { reaction } from 'mobx';
import { preferencesStore } from '../../../Preferences';
import { tmdbService } from '../../data/tmdbService';

export const TVShowIndexRedirect = () => {
  const { id } = useParams();
  const [seasonNum, setSeasonNum] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const loadFirstSeason = async () => {
      setSeasonNum(null);
      try {
        const show = await tmdbService.getTVShowDetail(Number(id));
        const first = show.seasons.find((s) => s.season_number > 0);
        if (!cancelled && first) setSeasonNum(first.season_number);
      } catch (err) {
        console.error('Failed to load show for redirect', err);
      }
    };

    void loadFirstSeason();

    const dispose = reaction(
      () => `${preferencesStore.language}-${preferencesStore.region}`,
      () => {
        void loadFirstSeason();
      }
    );

    return () => {
      cancelled = true;
      dispose();
    };
  }, [id]);

  if (seasonNum === null) {
    return <div className="text-slate-900 dark:text-white">Loading season...</div>;
  }

  return <Navigate to={`season/${seasonNum}`} replace />;
};