import type { Article, ArticleSummary } from '../../types';
import { mockArticles } from '../mock/articles';

export interface IArticleService {
  getAll(): Promise<ArticleSummary[]>;
  getBySlug(slug: string): Promise<Article | null>;
}

class MockArticleService implements IArticleService {
  async getAll(): Promise<ArticleSummary[]> {
    return mockArticles.map(({ content, author, updatedAt, ...summary }) => summary);
  }

  async getBySlug(slug: string): Promise<Article | null> {
    return mockArticles.find((a) => a.slug === slug) || null;
  }
}

export const articleService: IArticleService = new MockArticleService();
