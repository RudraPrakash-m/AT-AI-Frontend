import type { User } from '@/types';

export interface UserProfile extends User {
  jobTitle?: string;
  organization?: string;
  bio?: string;
  githubUrl?: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPreview: string;
  createdAt: string;
  lastUsedAt?: string;
}

export interface UsageMetric {
  date: string;
  tokens: number;
  requests: number;
}
