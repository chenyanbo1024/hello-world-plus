import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSearch } from '../hooks';
import { ArticleList } from '../components/features';
import { LoadingSpinner } from '../components/common';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { results, loading, error, meta, search } = useSearch(0);

  useEffect(() => {
    if (query) {
      search(query, page);
    }
  }, [query, page, search]);

  if (!query) {
    navigate('/');
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="flex items-center gap-2 font-mono text-sm text-text-muted mb-2">
        <span className="text-accent">//</span>
        <span>搜索结果</span>
      </div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">
        {query}
      </h1>
      {meta && (
        <p className="text-text-muted mb-8">
          找到 {meta.total} 篇相关文章
        </p>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-rose">搜索出错，请稍后再试</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted">未找到相关文章</p>
        </div>
      ) : (
        <section className="pb-20">
          <ArticleList articles={results} />
        </section>
      )}
    </div>
  );
}
