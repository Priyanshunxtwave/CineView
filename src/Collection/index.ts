export { watchlistStore } from './data/watchlistStore';
export type { WatchStatus, MediaType, WatchlistEntry, MediaSnapshot } from './core/collectionSchemas';
export {
  snapshotFromMovie,
  snapshotFromTVShow,
  snapshotFromSearchResult,
  mediaDetailPath,
} from './core/collectionUtils';
export { WATCH_STATUS_LABELS } from './core/collectionConstants';
export { WatchlistPage } from './ui/pages/WatchlistPage';
export { WatchlistActionButton } from './ui/components/WatchlistActionButton';