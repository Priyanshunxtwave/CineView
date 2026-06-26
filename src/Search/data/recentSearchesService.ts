import { z } from 'zod';

const STORAGE_KEY = 'cineview_recent_searches';
const MAX_ENTRIES = 10;

const StorageSchema = z.array(z.string()).max(MAX_ENTRIES);

export const recentSearchesService = {
  getAll: (): string[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    try {
      const parsed = JSON.parse(stored);
      const validation = StorageSchema.safeParse(parsed);
      if (validation.success) return validation.data;
      
      localStorage.removeItem(STORAGE_KEY); // Reset if corrupted
      return [];
    } catch {
      return [];
    }
  },

  add: (query: string): void => {
    const trimmed = query.trim();
    if (!trimmed) return;

    let searches = recentSearchesService.getAll();
    searches = searches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
    searches.unshift(trimmed);
    
    if (searches.length > MAX_ENTRIES) {
      searches = searches.slice(0, MAX_ENTRIES);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }
};