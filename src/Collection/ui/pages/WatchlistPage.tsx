import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { WATCH_STATUS_LABELS, WATCH_STATUS_ORDER } from '../../core/collectionConstants';
import { WatchStatus } from '../../core/collectionSchemas';
import { watchlistStore } from '../../data/watchlistStore';
import { WatchlistEntryCard } from '../components/WatchlistEntryCard';

type StatusFilter = 'all' | WatchStatus;
type SortOption = 'date_added' | 'rating' | 'title';

export const WatchlistPage = observer(() => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date_added');

  const list =
    statusFilter === 'all'
      ? [...watchlistStore.entries]
      : watchlistStore.entries.filter((e) => e.status === statusFilter);

  const filteredAndSorted = [...list].sort((a, b) => {
    if (sortBy === 'date_added') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'rating') {
      return (b.snapshot.voteAverage ?? 0) - (a.snapshot.voteAverage ?? 0);
    }
    return a.snapshot.title.localeCompare(b.snapshot.title);
  });

  const tabs: { key: StatusFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: watchlistStore.count },
    ...WATCH_STATUS_ORDER.map((status) => ({
      key: status as StatusFilter,
      label: WATCH_STATUS_LABELS[status],
      count: watchlistStore.countsByStatus[status],
    })),
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Watchlist</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Track what you want to watch, are watching, or have finished.
          </p>
        </div>

        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Sort by
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="ml-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="date_added">Date added</option>
            <option value="rating">Rating</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatusFilter(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              statusFilter === tab.key
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {watchlistStore.count === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your watchlist is empty</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Browse movies and TV shows, then tap <strong>+</strong> on any card or detail page.
          </p>
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-10 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-slate-600 dark:text-slate-400">No items in this filter.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredAndSorted.map((entry) => (
            <WatchlistEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
});