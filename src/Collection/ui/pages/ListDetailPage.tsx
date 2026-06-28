import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { ImageWithFallback } from '../../../Common/ui/components/ImageWithFallback/ImageWithFallback';
import { mediaDetailPath } from '../../core/collectionUtils';
import { collectionStore } from '../../data/collectionStore';
import { DeleteListDialog } from '../components/DeleteListDialog';

export const ListDetailPage = observer(() => {
  const { id } = useParams();
  const list = id ? collectionStore.getListById(id) : undefined;

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!list) {
    return (
      <div className="px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">List not found</h1>
        <Link to="/lists" className="mt-4 inline-block text-indigo-600 hover:underline">
          Back to My Lists
        </Link>
      </div>
    );
  }

  const startRename = () => {
    setNameDraft(list.name);
    setIsEditingName(true);
  };

  const saveRename = () => {
    if (nameDraft.trim()) collectionStore.renameList(list.id, nameDraft);
    setIsEditingName(false);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <Link to="/lists" className="text-sm text-indigo-600 hover:underline">
        ← Back to My Lists
      </Link>

      <div className="mt-4 mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          {isEditingName ? (
            <div className="flex gap-2">
              <input
                value={nameDraft}
                maxLength={60}
                onChange={(e) => setNameDraft(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button type="button" onClick={saveRename} className="rounded-lg bg-indigo-600 px-3 py-2 text-white">
                Save
              </button>
              <button type="button" onClick={() => setIsEditingName(false)} className="px-3 py-2 text-slate-500">
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{list.name}</h1>
              <button type="button" onClick={startRename} className="text-sm text-indigo-600 hover:underline">
                Rename
              </button>
            </div>
          )}
          {list.description && (
            <p className="mt-2 text-slate-600 dark:text-slate-400">{list.description}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowDeleteDialog(true)}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30"
        >
          Delete List
        </button>
      </div>

      {list.items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400">This list is empty.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.items.map((item) => (
            <article
              key={item.id}
              className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
            >
              <Link to={mediaDetailPath(item.mediaType, item.mediaId)}>
                <ImageWithFallback
                  src={
                    item.snapshot.posterPath
                      ? `https://image.tmdb.org/t/p/w154${item.snapshot.posterPath}`
                      : undefined
                  }
                  alt={item.snapshot.title}
                  className="h-24 w-16 rounded object-cover"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link
                  to={mediaDetailPath(item.mediaType, item.mediaId)}
                  className="truncate font-bold text-slate-900 dark:text-white"
                >
                  {item.snapshot.title}
                </Link>
                <button
                  type="button"
                  onClick={() => collectionStore.removeListItem(list.id, item.id)}
                  className="mt-auto self-start text-sm text-red-600 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <DeleteListDialog
        isOpen={showDeleteDialog}
        listName={list.name}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          collectionStore.deleteList(list.id);
          setShowDeleteDialog(false);
        }}
      />
    </div>
  );
});