import { AppLanguage, AppRegion, PreferencesState } from './preferencesTypes';

export const PREFERENCES_STORAGE_KEY = 'cineview_preferences';

export const DEFAULT_PREFERENCES: PreferencesState = {
  language: 'en',
  theme: 'dark',
  region: 'US',
};

export const TMDB_LANGUAGE_MAP: Record<AppLanguage, string> = {
  en: 'en-US',
  es: 'es-ES',
};

export const SUPPORTED_LANGUAGES: { value: AppLanguage; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
];

export const SUPPORTED_REGIONS: { value: AppRegion; label: string }[] = [
  { value: 'US', label: 'United States' },
  { value: 'IN', label: 'India' },
  { value: 'ES', label: 'Spain' },
];