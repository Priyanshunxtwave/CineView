import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { ImageWithFallback } from '../../../Common/ui/components/ImageWithFallback/ImageWithFallback';
import { WATCH_STATUS_LABELS } from '../../core/collectionConstants';
import { WatchlistEntry, WatchStatus } from '../../core/collectionSchemas';
import { mediaDetailPath } from '../../core/collectionUtils';
import { watchlistStore } from '../../data/watchlistStore';

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

          {entry.snapshot.voteAverage !== undefined && (
            <span className="rounded bg-yellow-500 px-2 py-1 text-xs font-bold text-black">
              ★ {entry.snapshot.voteAverage.toFixed(1)}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Status
            <select
              value={entry.status}
              onChange={(e) =>
                watchlistStore.updateStatus(entry.id, e.target.value as WatchStatus)
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
            onClick={() => watchlistStore.remove(entry.id)}
            className="text-sm font-semibold text-red-600 hover:text-red-500 dark:text-red-400"
          >
            Remove
          </button>
        </div>

        <textarea
          defaultValue={entry.note}
          maxLength={300}
          placeholder="Add a note (max 300 characters)..."
          onBlur={(e) => watchlistStore.updateNote(entry.id, e.target.value)}
          className="min-h-[80px] w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
      </div>
    </article>
  );
});