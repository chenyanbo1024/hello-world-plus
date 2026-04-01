import { useState, useEffect } from 'react';
import { articleService } from '../api';
import type { ArticleSummary } from '../types';

export function useArticles() {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    articleService
      .getAll()
      .then(setArticles)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { articles, loading, error };
}
