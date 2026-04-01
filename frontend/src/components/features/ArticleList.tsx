import { ArticleCard } from './ArticleCard';
import type { ArticleSummary } from '../../types';

interface ArticleListProps {
  articles: ArticleSummary[];
}

export function ArticleList({ articles }: ArticleListProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {articles.map((article, i) => (
        <div
          key={article.id}
          className="fade-up"
          style={{ animationDelay: `${0.1 + i * 0.08}s` }}
        >
          <ArticleCard article={article} />
        </div>
      ))}
    </div>
  );
}
