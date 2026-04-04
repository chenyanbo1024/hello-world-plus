import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useArticle } from '../hooks';
import { ArticleContent, TableOfContents } from '../components/features';
import { LoadingSpinner } from '../components/common';
import { Tag } from '../components/common/Tag';
import { formatDate } from '../utils';
import { extractHeadings } from '../utils/extractHeadings';

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { article, loading, error } = useArticle(slug || '');
  const [tocOpen, setTocOpen] = useState(false);

  const headings = article ? extractHeadings(article.content) : [];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-6 py-20 max-w-4xl text-center">
        <div className="font-mono text-sm text-text-muted mb-4">404</div>
        <p className="text-rose mb-6">文章未找到</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <>
      <TableOfContents headings={headings} isOpen={tocOpen} onToggle={() => setTocOpen((v) => !v)} />

      <div className="container mx-auto px-6 max-w-3xl">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent transition-colors mt-8 mb-12 text-sm group"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-mono">cd ..</span>
        </Link>

        {/* Article header */}
        <header className="mb-10 fade-up">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {article.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight tracking-tight mb-6">
            {article.title}
          </h1>

          {/* Meta bar */}
          <div className="flex items-center gap-3 py-4 border-t border-b border-border/60">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/40 to-accent/10 flex items-center justify-center border border-accent/20">
              <span className="text-xs font-bold text-accent">
                {article.author.name.charAt(0)}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="text-text-primary font-medium">
                {article.author.name}
              </span>
              <span className="text-border-bright">|</span>
              <time dateTime={article.publishedAt} className="text-text-muted font-mono text-xs">
                {formatDate(article.publishedAt)}
              </time>
              <span className="text-border-bright">|</span>
              <span className="text-text-muted flex items-center gap-1 text-xs">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {article.readingTime} 分钟阅读
              </span>
            </div>
          </div>
        </header>

        {/* Article body */}
        <article className="mb-16 fade-up" style={{ animationDelay: '0.15s' }}>
          <ArticleContent content={article.content} />
        </article>

        {/* Author card */}
        <footer className="border-t border-border pt-8 pb-16 fade-up" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-start gap-4 p-5 rounded-lg bg-bg-secondary border border-border">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center border border-accent/20 shrink-0">
              <span className="text-lg font-bold text-accent">
                {article.author.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-semibold text-text-primary mb-0.5">{article.author.name}</p>
              {article.author.bio && (
                <p className="text-sm text-text-muted leading-relaxed">{article.author.bio}</p>
              )}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
