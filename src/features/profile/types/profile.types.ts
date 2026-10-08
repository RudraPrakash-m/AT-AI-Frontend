import type { User } from '@/types';

export interface UserProfile extends User {
  jobTitle?: string;
  organization?: string;
  bio?: string;
  githubUrl?: string;
  ollamaBaseUrl?: string;
}

export interface OllamaInstalledModel {
  name: string;
  size?: number;
  digest?: string;
  details?: {
    format?: string;
    family?: string;
    families?: string[];
    parameter_size?: string;
    quantization_level?: string;
  };
}

export interface OllamaConfig {
  url: string;
  userCustomUrl?: string;
  connected: boolean;
  latencyMs?: number;
  models: OllamaInstalledModel[];
  defaultModel?: string;
  error?: string;
}

export interface TestOllamaResult {
  connected: boolean;
  url: string;
  latencyMs?: number;
  models: OllamaInstalledModel[];
  defaultModel?: string;
  error?: string;
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
