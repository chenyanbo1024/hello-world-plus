import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Tag } from '../common/Tag';
import { formatDate } from '../../utils';
import type { ArticleSummary } from '../../types';

interface ArticleCardProps {
  article: ArticleSummary;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link to={`/article/${article.slug}`} className="group block">
      <Card className="h-full relative overflow-hidden">
        {/* Subtle gradient accent on hover */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full" />

        <article className="flex flex-col h-full relative">
          {/* Title */}
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2 leading-snug group-hover:text-accent transition-colors duration-200">
              {article.title}
            </h2>
            <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {article.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>

          {/* Meta */}
          <div className="mt-auto pt-3 border-t border-border/60 flex items-center justify-between text-xs text-text-muted">
            <time dateTime={article.publishedAt} className="font-mono">
              {formatDate(article.publishedAt)}
            </time>
            <span className="flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {article.readingTime} min
            </span>
          </div>
        </article>
      </Card>
    </Link>
  );
}
