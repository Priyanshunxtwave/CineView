export const validateEnv = (): void => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: VITE_TMDB_API_KEY is missing. App may fail to fetch data.");
    }
  };