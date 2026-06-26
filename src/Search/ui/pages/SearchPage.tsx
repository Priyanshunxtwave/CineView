import { useState, useEffect } from 'react';
import { reaction } from 'mobx';
import { useDebounce } from '../../../Common/ui/hooks/useDebounce';
import { preferencesStore } from '../../../Preferences';
import { tmdbService } from '../../../Movies/data/tmdbService';
import { recentSearchesService } from '../../data/recentSearchesService';
import { SearchResult } from '../../core/searchSchemas';
import { groupSearchResults } from '../../core/searchUtils';
import { ResultGroup } from '../components/ResultGroup/ResultGroup';

export const SearchPage = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(
    recentSearchesService.getAll()
  );

  const trimmedQuery = debouncedQuery.trim();

  // Search when query changes
  useEffect(() => {
    if (!trimmedQuery) return;

    let cancelled = false;

    const run = async () => {
      setIsSearching(true);
      try {
        const data = await tmdbService.search(trimmedQuery);
        if (cancelled) return;
        setResults(data);
        recentSearchesService.add(trimmedQuery);
        setRecentSearches(recentSearchesService.getAll());
      } catch (error) {
        if (!cancelled) console.error('Search failed', error);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [trimmedQuery]);

  // Refetch when language/region changes (only if query is active)
  useEffect(() => {
    const dispose = reaction(
      () => `${preferencesStore.language}-${preferencesStore.region}`,
      () => {
        if (!trimmedQuery) return;

        void (async () => {
          setIsSearching(true);
          try {
            const data = await tmdbService.search(trimmedQuery);
            setResults(data);
          } catch (error) {
            console.error('Search failed', error);
          } finally {
            setIsSearching(false);
          }
        })();
      }
    );

    return dispose;
  }, [trimmedQuery]);

  // Derived — do NOT call setResults([]) in an effect
  const visibleResults = trimmedQuery ? results : [];
  const grouped = groupSearchResults(visibleResults);
  const showSearching = Boolean(trimmedQuery && isSearching);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for movies or TV shows..."
        className="w-full p-4 bg-white dark:bg-gray-800 text-slate-900 dark:text-white rounded-lg border border-slate-300 dark:border-gray-700 focus:border-blue-500 outline-none text-lg mb-8"
      />

      {!query && recentSearches.length > 0 && (
        <div className="mb-8">
         <h3 className="text-slate-700 dark:text-gray-400 mb-4 text-sm font-semibold">  

                RECENT SEARCHES
          </h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuery(term)}
                className="px-3 py-1 bg-slate-200 dark:bg-gray-800 hover:bg-slate-300 dark:hover:bg-gray-700 text-sm text-slate-700 dark:text-gray-300 rounded-full transition"
              >
                {term}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                recentSearchesService.clear();
                setRecentSearches([]);
              }}
              className="px-3 py-1 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 ml-2"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {showSearching ? (
        <div className="py-12 text-center text-slate-500">Searching...</div>
      ) : trimmedQuery ? (
        <>
          <ResultGroup title="Movies" items={grouped.movies} />
          <ResultGroup title="TV Shows" items={grouped.tvShows} />
          <ResultGroup title="People" items={grouped.people} />
          {visibleResults.length === 0 && (
            <p className="text-center text-slate-500">No results found.</p>
          )}
        </>
      ) : null}
    </div>
  );
};