import { makeAutoObservable, runInAction } from 'mobx';
import { z } from 'zod';
import {
  DEFAULT_PREFERENCES,
  PREFERENCES_STORAGE_KEY,
  TMDB_LANGUAGE_MAP,
} from '../core/preferencesConstants';
import { AppLanguage, AppRegion, PreferencesState, Theme } from '../core/preferencesTypes';

const PreferencesSchema = z.object({
  language: z.enum(['en', 'es']),
  theme: z.enum(['light', 'dark']),
  region: z.enum(['US', 'IN', 'ES']),
});

const getOsTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

class PreferencesStore {
  language: AppLanguage = DEFAULT_PREFERENCES.language;
  theme: Theme = DEFAULT_PREFERENCES.theme;
  region: AppRegion = DEFAULT_PREFERENCES.region;
  isInitialized = false;

  constructor() {
    makeAutoObservable(this);
  }

  get tmdbLanguage(): string {
    return TMDB_LANGUAGE_MAP[this.language];
  }

  init(): void {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (raw) {
      const parsed = PreferencesSchema.safeParse(JSON.parse(raw));
      if (parsed.success) {
        runInAction(() => {
          this.language = parsed.data.language;
          this.theme = parsed.data.theme;
          this.region = parsed.data.region;
        });
      }
    } else {
      runInAction(() => {
        this.theme = getOsTheme();
      });
    }

    this.applyThemeToDom();
    this.isInitialized = true;
  }

  private persist(): void {
    const state: PreferencesState = {
      language: this.language,
      theme: this.theme,
      region: this.region,
    };
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state));
  }

  private applyThemeToDom(): void {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(this.theme);
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  setLanguage(language: AppLanguage): void {
    this.language = language;
    this.persist();
  }

  setTheme(theme: Theme): void {
    this.theme = theme;
    this.applyThemeToDom();
    this.persist();
  }

  toggleTheme(): void {
    this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

  setRegion(region: AppRegion): void {
    this.region = region;
    this.persist();
  }
}

export const preferencesStore = new PreferencesStore();