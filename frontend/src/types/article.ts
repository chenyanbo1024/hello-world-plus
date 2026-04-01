export interface Author {
  name: string;
  avatar?: string;
  bio?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  tags: string[];
  category: string;
}

export interface ArticleSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  publishedAt: string;
  readingTime: number;
  tags: string[];
  category: string;
}
