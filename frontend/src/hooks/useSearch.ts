import { useState, useCallback, useRef } from 'react';
import { articleService } from '../api';
import type { SearchMeta } from '../types/search';
import type { ArticleSummary } from '../types';

export function useSearch(debounceMs = 300) {
  const [results, setResults] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [meta, setMeta] = useState<SearchMeta | null>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const search = useCallback(async (query: string, page = 1) => {
    if (abortController.current) {
      abortController.current.abort();
    }

    if (!query.trim()) {
      setResults([]);
      setMeta(null);
      return;
    }

    setLoading(true);
    setError(null);
    abortController.current = new AbortController();

    try {
      const response = await articleService.search(query, page);
      setResults(response.data);
      setMeta(response.meta);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    (query: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        search(query);
      }, debounceMs);
    },
    [search, debounceMs]
  );

  const clear = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    if (abortController.current) {
      abortController.current.abort();
    }
    setResults([]);
    setMeta(null);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    meta,
    search,
    debouncedSearch,
    clear,
  };
}
