import { observer } from 'mobx-react-lite';
import { collectionStore } from '../../data/collectionStore';

interface EpisodeProgressBadgeProps {
  showId: number;
  totalEpisodes?: number;
}

export const EpisodeProgressBadge = observer(({ showId, totalEpisodes }: EpisodeProgressBadgeProps) => {
  const watched = collectionStore.episodeProgress.filter((p) => p.showId === showId).length;

  if (watched === 0 && !totalEpisodes) return null;

  const label =
    totalEpisodes && totalEpisodes > 0
      ? `${watched}/${totalEpisodes} eps`
      : `${watched} eps watched`;

  return (
    <span className="rounded-full bg-green-600/15 px-2 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
      {label}
    </span>
  );
});