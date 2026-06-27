import { observer } from 'mobx-react-lite';
import { watchlistStore } from '../../data/watchlistStore';
import { MediaSnapshot, MediaType } from '../../core/collectionSchemas';

interface WatchlistActionButtonProps {
  mediaType: MediaType;
  mediaId: number;
  snapshot: MediaSnapshot;
  variant?: 'banner' | 'detail';
}

export const WatchlistActionButton = observer(
  ({ mediaType, mediaId, snapshot, variant = 'detail' }: WatchlistActionButtonProps) => {
    const inList = watchlistStore.isInWatchlist(mediaType, mediaId);

    const base =
      variant === 'banner'
        ? 'px-6 py-2.5 text-sm font-semibold rounded-full transition-all border backdrop-blur-sm flex items-center gap-2'
        : 'rounded-lg px-8 py-3 font-bold shadow-lg transition';

    const activeClass =
      variant === 'banner'
        ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500'
        : 'bg-indigo-600 hover:bg-indigo-500 text-white';

    const inactiveClass =
      variant === 'banner'
        ? 'bg-slate-800/80 hover:bg-slate-700 text-white border-slate-700'
        : 'bg-slate-700 hover:bg-slate-600 text-white';

    return (
      <button
        type="button"
        onClick={() => watchlistStore.toggle(mediaType, mediaId, snapshot)}
        className={`${base} ${inList ? activeClass : inactiveClass}`}
      >
        {inList ? '✓ In Watchlist' : '+ Watchlist'}
      </button>
    );
  }
);