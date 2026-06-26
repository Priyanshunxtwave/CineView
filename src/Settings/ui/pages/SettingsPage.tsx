import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { preferencesStore } from '../../../Preferences';
import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_REGIONS,
} from '../../../Preferences/core/preferencesConstants';
import { sessionService } from '../../../Auth/data/sessionService';
import type { AppLanguage, AppRegion, Theme } from '../../../Preferences/core/preferencesTypes';

export const SettingsPage = observer(() => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionService.logout();
    navigate('/login', { replace: true });
  };

  const selectClass =
    'w-full p-3 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-white outline-none focus:border-blue-500';

  const sectionClass = 'space-y-2';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-gray-300';

  return (
    <div className="max-w-lg mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>

      {/* Language — affects login form + TMDB API, NOT rest of UI */}
      <section className={sectionClass}>
        <label htmlFor="language" className={labelClass}>
          Language
        </label>
        <p className="text-xs text-slate-500 dark:text-gray-400 mb-2">
          Changes login screen language and movie/TV content from TMDB.
        </p>
        <select
          id="language"
          value={preferencesStore.language}
          onChange={(e) => preferencesStore.setLanguage(e.target.value as AppLanguage)}
          className={selectClass}
        >
          {SUPPORTED_LANGUAGES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </section>

      {/* Region — affects TMDB availability/ranking */}
      <section className={sectionClass}>
        <label htmlFor="region" className={labelClass}>
          Region
        </label>
        <select
          id="region"
          value={preferencesStore.region}
          onChange={(e) => preferencesStore.setRegion(e.target.value as AppRegion)}
          className={selectClass}
        >
          {SUPPORTED_REGIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </section>

      {/* Theme */}
      <section className={sectionClass}>
        <span className={labelClass}>Theme</span>
        <div className="flex gap-3 mt-2">
          {(['light', 'dark'] as Theme[]).map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => preferencesStore.setTheme(theme)}
              className={`px-5 py-2 rounded-lg font-medium transition ${
                preferencesStore.theme === theme
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-800 dark:bg-gray-700 dark:text-white hover:opacity-90'
              }`}
            >
              {theme === 'light' ? 'Light' : 'Dark'}
            </button>
          ))}
        </div>
      </section>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition"
      >
        Logout
      </button>
    </div>
  );
});