import { describe, it, expect, vi, afterEach } from 'vitest';
import { validateEnv } from './commonUtils';

describe('Environment Validator', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('triggers a console warning when VITE_TMDB_API_KEY is completely missing', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Force the environment variable to be empty
    vi.stubEnv('VITE_TMDB_API_KEY', '');
    validateEnv();
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('VITE_TMDB_API_KEY is missing')
    );
  });
});