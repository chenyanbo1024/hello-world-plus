import { useState, useEffect } from 'react';
import { articleService } from '../api';
import type { Article } from '../types';

export function useArticle(slug: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    articleService
      .getBySlug(slug)
      .then(setArticle)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [slug]);

  return { article, loading, error };
}
