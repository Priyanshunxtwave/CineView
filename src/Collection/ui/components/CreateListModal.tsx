import { FormEvent, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { collectionStore } from '../../data/collectionStore';
import { MAX_LIST_DESCRIPTION_LENGTH, MAX_LIST_NAME_LENGTH } from '../../core/collectionConstants';

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateListModal = observer(({ isOpen, onClose }: CreateListModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    collectionStore.createList({ name, description });
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900"
      >
        <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Create List</h2>

        <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Name
          <input
            value={name}
            maxLength={MAX_LIST_NAME_LENGTH}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            autoFocus
          />
        </label>

        <label className="mb-6 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Description (optional)
          <textarea
            value={description}
            maxLength={MAX_LIST_DESCRIPTION_LENGTH}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 min-h-[80px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </label>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-slate-600 dark:text-slate-300">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500">
            Create
          </button>
        </div>
      </form>
    </div>
  );
});