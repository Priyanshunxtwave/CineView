import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { ImageWithFallback } from '../../../Common/ui/components/ImageWithFallback/ImageWithFallback';
import { WATCH_STATUS_LABELS } from '../../core/collectionConstants';
import { WatchlistEntry, WatchStatus } from '../../core/collectionSchemas';
import { mediaDetailPath } from '../../core/collectionUtils';
import { collectionStore } from '../../data/collectionStore';
import { EpisodeProgressBadge } from './EpisodeProgressBadge';
import { WatchlistNoteEditor } from './WatchlistNoteEditor';

interface WatchlistEntryCardProps {
  entry: WatchlistEntry;
}

export const WatchlistEntryCard = observer(({ entry }: WatchlistEntryCardProps) => {
  const posterUrl = entry.snapshot.posterPath
    ? `https://image.tmdb.org/t/p/w300${entry.snapshot.posterPath}`
    : undefined;

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:flex-row">
      <Link
        to={mediaDetailPath(entry.mediaType, entry.mediaId)}
        className="shrink-0"
      >
        <ImageWithFallback
          src={posterUrl}
          alt={entry.snapshot.title}
          className="h-40 w-28 rounded-lg object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {/* Title row */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <Link
              to={mediaDetailPath(entry.mediaType, entry.mediaId)}
              className="text-lg font-bold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
            >
              {entry.snapshot.title}
            </Link>
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {entry.mediaType} · Added {new Date(entry.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {entry.mediaType === 'tv' && (
              <EpisodeProgressBadge
                showId={entry.mediaId}
                {...(entry.snapshot.totalEpisodes !== undefined
                  ? { totalEpisodes: entry.snapshot.totalEpisodes }
                  : {})}
              />
            )}
            {entry.snapshot.voteAverage !== undefined && (
              <span className="rounded bg-yellow-500 px-2 py-1 text-xs font-bold text-black">
                ★ {entry.snapshot.voteAverage.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* Status row */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Status
            <select
              value={entry.status}
              onChange={(e) =>
                collectionStore.updateWatchlistStatus(entry.id, e.target.value as WatchStatus)
              }
              className="ml-2 rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {(Object.keys(WATCH_STATUS_LABELS) as WatchStatus[]).map((status) => (
                <option key={status} value={status}>
                  {WATCH_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => collectionStore.removeFromWatchlist(entry.id)}
            className="text-sm font-semibold text-red-600 hover:text-red-500 dark:text-red-400"
          >
            Remove
          </button>
        </div>

        {/* Step 22: note editor (replaces old textarea) */}
        <WatchlistNoteEditor
          key={`${entry.id}-${entry.updatedAt}`}
          initialNote={entry.note}
          onSave={(note) => collectionStore.updateWatchlistNote(entry.id, note)}
          onClear={() => collectionStore.clearWatchlistNote(entry.id)}
        />
      </div>
    </article>
  );
});