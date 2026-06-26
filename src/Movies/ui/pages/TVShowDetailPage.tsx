import { useEffect, useState } from 'react';
import { useParams, Outlet, NavLink } from 'react-router-dom';
import { reaction } from 'mobx';
import { preferencesStore } from '../../../Preferences';
import { tmdbService } from '../../../Movies/data/tmdbService';
import { ImageWithFallback } from '../../../Common/ui/components/ImageWithFallback/ImageWithFallback';
import { TVShowDetail, SeasonSummary } from '../../core/movieSchemas';

export const TVShowDetailPage = () => {
  const { id } = useParams();
  const [show, setShow] = useState<TVShowDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const loadShow = async () => {
      setIsLoading(true);
      try {
        const data = await tmdbService.getTVShowDetail(Number(id));
        if (!cancelled) setShow(data);
      } catch (err) {
        console.error('Failed to load TV show', err);
        if (!cancelled) setShow(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadShow();

    const dispose = reaction(
      () => `${preferencesStore.language}-${preferencesStore.region}`,
      () => {
        void loadShow();
      }
    );

    return () => {
      cancelled = true;
      dispose();
    };
  }, [id]);

  // ... rest unchanged

  if (isLoading) {
    return <div className="text-slate-900 dark:text-white text-center py-20 animate-pulse">Loading Show...</div>;
  }

  if (!show) {
    return <div className="text-center py-20 text-red-500">Show not found.</div>;
  }

  return (
    <div className="text-slate-900 dark:text-white pb-12">
      <div className="h-auto bg-slate-100 dark:bg-slate-900 p-8 md:p-12 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-8 items-start">
        <ImageWithFallback
          src={show.poster_path ? `https://image.tmdb.org/t/p/w300${show.poster_path}` : undefined}
          alt={show.name}
          className="w-48 rounded-xl shadow-lg"
        />
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{show.name}</h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mb-6">{show.overview}</p>

          <h3 className="text-lg font-bold mb-3 text-slate-500 dark:text-slate-400 uppercase tracking-wider">Seasons</h3>
          <div className="flex flex-wrap gap-2">
            {show.seasons
              .filter((s: SeasonSummary) => s.season_number > 0)
              .map((season) => (
                <NavLink
                  key={season.id}
                  to={`season/${season.season_number}`}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                    }`
                  }
                >
                  {season.name || `Season ${season.season_number}`}
                </NavLink>
              ))}
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <Outlet context={{ showId: id }} />
      </div>
    </div>
  );
};