import type { Article, ArticleSummary } from '../../types';

const API_BASE_URL = '/api/v1';

export interface IArticleService {
  getAll(): Promise<ArticleSummary[]>;
  getBySlug(slug: string): Promise<Article | null>;
}

class RealArticleService implements IArticleService {
  private async fetchJSON<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        return null as T;
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async getAll(): Promise<ArticleSummary[]> {
    const url = `${API_BASE_URL}/articles?published=true`;
    return this.fetchJSON<ArticleSummary[]>(url);
  }

  async getBySlug(slug: string): Promise<Article | null> {
    return this.fetchJSON<Article | null>(`${API_BASE_URL}/articles/slug/${slug}`);
  }
}

// Use real API service
export const articleService: IArticleService = new RealArticleService();
