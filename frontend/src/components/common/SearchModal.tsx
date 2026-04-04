import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../hooks';
import { LoadingSpinner } from './LoadingSpinner';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { results, loading, meta, debouncedSearch, clear } = useSearch(300);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      clear();
    }
  }, [isOpen, clear]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleResultClick = (slug: string) => {
    onClose();
    navigate(`/article/${slug}`);
  };

  const handleViewAll = () => {
    onClose();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative flex items-start justify-center pt-[15vh] px-4">
        <div className="w-full max-w-xl bg-bg-card border border-border rounded-xl shadow-2xl">
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <svg
              className="w-5 h-5 text-text-muted flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="搜索文章..."
              className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-base"
            />
            <kbd className="px-2 py-0.5 text-xs text-text-muted bg-bg-secondary border border-border rounded">
              ESC
            </kbd>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {loading && (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            )}

            {!loading && query && results.length === 0 && (
              <div className="text-center py-8 text-text-muted">
                未找到 "{query}" 相关文章
              </div>
            )}

            {!loading && results.length > 0 && (
              <>
                <ul className="py-2">
                  {results.map((article) => (
                    <li key={article.id}>
                      <button
                        type="button"
                        onClick={() => handleResultClick(article.slug)}
                        className="w-full px-4 py-3 text-left hover:bg-bg-hover transition-colors"
                      >
                        <div className="font-medium text-text-primary line-clamp-1">
                          {article.title}
                        </div>
                        <div className="text-sm text-text-muted mt-0.5 line-clamp-1">
                          {article.excerpt}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>

                {meta && meta.total > results.length && (
                  <div className="p-3 border-t border-border">
                    <button
                      type="button"
                      onClick={handleViewAll}
                      className="w-full py-2 text-sm text-accent hover:text-accent-hover transition-colors"
                    >
                      查看全部 {meta.total} 条结果
                    </button>
                  </div>
                )}
              </>
            )}

            {!query && (
              <div className="text-center py-8 text-text-muted">
                输入关键词开始搜索
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
