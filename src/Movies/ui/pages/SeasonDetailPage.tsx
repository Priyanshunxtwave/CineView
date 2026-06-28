import { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { preferencesStore } from '../../../Preferences';
import { tmdbService } from '../../../Movies/data/tmdbService';
import { Episode } from '../../core/movieSchemas';
import { collectionStore, getProgressPercent } from '../../../Collection';

export const SeasonDetailPage = observer(() => {
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
      } catch (err) {
        console.error('Failed to load season', err);
        if (!cancelled) setEpisodes([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadSeason();

    const dispose = reaction(
      () => `${preferencesStore.language}-${preferencesStore.region}`,
      () => {
        void loadSeason();
      }
    );

    return () => {
      cancelled = true;
      dispose();
    };
  }, [showId, seasonNum]);

  if (isLoading) {
    return <div className="py-8 text-center text-slate-500">Loading episodes...</div>;
  }

  if (episodes.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        No episodes found for this season.
      </div>
    );
  }

  const showIdNum = Number(showId);
  const seasonNumber = Number(seasonNum);
  const progress = collectionStore.getSeasonProgress(showIdNum, seasonNumber, episodes.length);
  const percent = getProgressPercent(progress.watched, progress.total);

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Season {seasonNum}
          </h2>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {progress.watched}/{progress.total} watched ({percent}%)
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              collectionStore.markAllEpisodes(
                showIdNum,
                seasonNumber,
                episodes.map((ep) => ep.episode_number)
              )
            }
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Mark all
          </button>
          <button
            type="button"
            onClick={() => collectionStore.unmarkAllEpisodes(showIdNum, seasonNumber)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Unmark all
          </button>
        </div>
      </div>

      {episodes.map((ep) => (
        <label
          key={ep.id}
          className="flex cursor-pointer gap-3 rounded-lg border border-slate-200 bg-slate-100 p-4 transition hover:border-indigo-400 dark:border-slate-800 dark:bg-gray-900 dark:hover:border-indigo-500"
        >
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 accent-indigo-600"
            checked={collectionStore.isEpisodeWatched(showIdNum, seasonNumber, ep.episode_number)}
            onChange={() =>
              collectionStore.toggleEpisode(showIdNum, seasonNumber, ep.episode_number)
            }
          />
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white">
              {ep.episode_number}. {ep.name}
            </h3>
            {ep.air_date && (
              <p className="text-xs text-slate-500 dark:text-slate-400">{ep.air_date}</p>
            )}
            <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">{ep.overview}</p>
          </div>
        </label>
      ))}
    </div>
  );
});