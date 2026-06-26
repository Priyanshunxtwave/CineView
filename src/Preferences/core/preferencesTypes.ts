export type Theme = 'light' | 'dark';
export type AppLanguage = 'en' | 'es'; // add more if needed
export type AppRegion = 'US' | 'IN' | 'ES';

export interface PreferencesState {
  language: AppLanguage;
  theme: Theme;
  region: AppRegion;
}