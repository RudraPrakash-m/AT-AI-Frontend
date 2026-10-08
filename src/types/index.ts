export type Nullable<T> = T | null;

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  tokensUsed: number;
  tokenLimit: number;
  jobTitle?: string;
  organization?: string;
  bio?: string;
  ollamaBaseUrl?: string;
  createdAt: string;
}

export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  description: string;
  badge: string;
  isPro: boolean;
  contextWindow: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
}
