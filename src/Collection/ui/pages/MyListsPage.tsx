import { useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { ImageWithFallback } from '../../../Common/ui/components/ImageWithFallback/ImageWithFallback';
import { collectionStore } from '../../data/collectionStore';
import { CreateListModal } from '../components/CreateListModal';

export const MyListsPage = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Lists</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Organize movies and shows into custom collections.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          + Create List
        </button>
      </div>

      {collectionStore.customLists.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400">No custom lists yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collectionStore.customLists.map((list) => (
            <Link
              key={list.id}
              to={`/lists/${list.id}`}
              className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900"
            >
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{list.name}</h2>
              {list.description && (
                <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{list.description}</p>
              )}
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {list.items.length} items
              </p>
              <div className="mt-3 flex gap-2">
                {list.items.slice(0, 4).map((item) => (
                  <ImageWithFallback
                    key={item.id}
                    src={
                      item.snapshot.posterPath
                        ? `https://image.tmdb.org/t/p/w92${item.snapshot.posterPath}`
                        : undefined
                    }
                    alt={item.snapshot.title}
                    className="h-16 w-11 rounded object-cover"
                  />
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}

      <CreateListModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
});