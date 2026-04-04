import type { ArticleSummary } from './article';

export interface SearchMeta {
  query: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchResponse {
  data: ArticleSummary[];
  meta: SearchMeta;
}
