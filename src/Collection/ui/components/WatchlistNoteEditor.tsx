import { useState } from 'react';
import { MAX_NOTE_LENGTH, NOTE_WARNING_THRESHOLD } from '../../core/collectionConstants';

interface WatchlistNoteEditorProps {
  initialNote: string;
  onSave: (note: string) => void;
  onClear: () => void;
}

export const WatchlistNoteEditor = ({ initialNote, onSave, onClear }: WatchlistNoteEditorProps) => {
  const [draft, setDraft] = useState(initialNote);
  const [isEditing, setIsEditing] = useState(false);
  const count = draft.length;
  const nearLimit = count >= NOTE_WARNING_THRESHOLD;

  const handleSave = () => {
    onSave(draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(initialNote);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="space-y-2">
        <p className="min-h-[40px] whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
          {initialNote.trim() ? initialNote : 'No note yet.'}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Edit note
          </button>
          {initialNote.trim() && (
            <button
              type="button"
              onClick={onClear}
              className="text-sm font-semibold text-red-600 hover:text-red-500"
            >
              Clear note
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <textarea
        value={draft}
        maxLength={MAX_NOTE_LENGTH}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Add a private note (max 300 characters)..."
        className="min-h-[90px] w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
      <div className={`text-xs ${nearLimit ? 'font-bold text-amber-600' : 'text-slate-500'}`}>
        {count}/{MAX_NOTE_LENGTH}
        {nearLimit && ' — approaching limit'}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Save
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-3 py-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};