import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { collectionStore } from '../../data/collectionStore';
import { MediaSnapshot, MediaType } from '../../core/collectionSchemas';
import { CreateListModal } from './CreateListModal';

interface AddToListPopoverProps {
  mediaType: MediaType;
  mediaId: number;
  snapshot: MediaSnapshot;
  variant?: 'card' | 'detail';
}

export const AddToListPopover = observer(
  ({ mediaType, mediaId, snapshot, variant = 'card' }: AddToListPopoverProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const buttonClass =
      variant === 'card'
        ? 'flex h-8 w-8 items-center justify-center rounded-full bg-slate-700/80 text-white hover:bg-indigo-600'
        : 'rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600';

    return (
      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          className={buttonClass}
          title="Add to list"
        >
          ☰
        </button>

        {isOpen && (
          <div
            className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Add to list</p>

            {collectionStore.customLists.length === 0 ? (
              <p className="text-sm text-slate-500">No lists yet.</p>
            ) : (
              collectionStore.customLists.map((list) => (
                <label
                  key={list.id}
                  className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <input
                    type="checkbox"
                    checked={collectionStore.isInList(list.id, mediaType, mediaId)}
                    onChange={() => collectionStore.toggleListItem(list.id, mediaType, mediaId, snapshot)}
                  />
                  <span className="truncate">{list.name}</span>
                </label>
              ))
            )}

            <button
              type="button"
              onClick={() => {
                setShowCreateModal(true);
                setIsOpen(false);
              }}
              className="mt-2 w-full rounded-lg border border-dashed border-slate-300 py-1.5 text-sm text-indigo-600 dark:border-slate-600"
            >
              + New list
            </button>
          </div>
        )}

        <CreateListModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
      </div>
    );
  }
);