import { useState, useEffect } from 'react';
import { useDebounce } from '../../../Common/ui/hooks/useDebounce';
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

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) return;

    let cancelled = false;

    const performSearch = async () => {
      setIsSearching(true);
      try {
        const data = await tmdbService.search(trimmed);
        if (cancelled) return;
        setResults(data);
        recentSearchesService.add(trimmed);
        setRecentSearches(recentSearchesService.getAll());
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    };

    performSearch();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const trimmedQuery = debouncedQuery.trim();
  const visibleResults = trimmedQuery ? results : [];
  const grouped = groupSearchResults(visibleResults);

  const showSearching = Boolean(trimmedQuery && isSearching);

  return (
    <div className="max-w-6xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for movies or TV shows..."
        className="w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 outline-none text-lg mb-8"
      />

      {!query && recentSearches.length > 0 && (
        <div className="mb-8">
          <h3 className="text-gray-400 mb-4 text-sm font-semibold">RECENT SEARCHES</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(term)}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 rounded-full transition"
              >
                {term}
              </button>
            ))}
            <button
              onClick={() => {
                recentSearchesService.clear();
                setRecentSearches([]);
              }}
              className="px-3 py-1 text-sm text-red-400 hover:text-red-300 ml-2"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

{showSearching ? (
  <div className="py-12 text-center text-gray-500">Searching...</div>
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