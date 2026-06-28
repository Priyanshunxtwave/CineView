interface DeleteListDialogProps {
    isOpen: boolean;
    listName: string;
    onConfirm: () => void;
    onCancel: () => void;
  }
  
  export const DeleteListDialog = ({ isOpen, listName, onConfirm, onCancel }: DeleteListDialogProps) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Delete list?</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            &ldquo;{listName}&rdquo; will be deleted. Watchlist entries are not affected.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-slate-600 dark:text-slate-300">
              Cancel
            </button>
            <button type="button" onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500">
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };