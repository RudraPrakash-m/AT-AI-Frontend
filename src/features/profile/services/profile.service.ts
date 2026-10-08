import { STORAGE_KEYS } from '@/constants';
import { storage } from '@/utils/storage.utils';
import { generateId } from '@/utils/string.utils';
import { getApiUrl } from '@/config/env';
import type { UserProfile, ApiKeyItem, UsageMetric, OllamaConfig, TestOllamaResult } from '../types/profile.types';

const INITIAL_PROFILE: UserProfile = {
  id: 'usr_default',
  name: 'User',
  email: 'user@example.com',
  plan: 'Pro',
  tokensUsed: 0,
  tokenLimit: 500000,
  jobTitle: '',
  organization: '',
  bio: '',
  createdAt: new Date().toISOString(),
};

const INITIAL_KEYS: ApiKeyItem[] = [
  {
    id: 'key_1',
    name: 'Production Server Secret',
    keyPreview: 'sk-aura-live-••••••••98fe',
    createdAt: '2026-02-10T14:20:00.000Z',
    lastUsedAt: '2026-10-06T08:12:00.000Z',
  },
  {
    id: 'key_2',
    name: 'Local Dev Environment',
    keyPreview: 'sk-aura-dev-••••••••41b2',
    createdAt: '2026-03-01T11:00:00.000Z',
    lastUsedAt: '2026-10-05T19:45:00.000Z',
  },
];

class ProfileService {
  private getHeaders(): HeadersInit {
    const token = storage.get<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async getProfile(): Promise<UserProfile> {
    const token = storage.get<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
    const cachedUser = storage.get<UserProfile | null>(STORAGE_KEYS.USER_DATA, null);

    if (!token) {
      return cachedUser || storage.get<UserProfile>('aura_user_profile', INITIAL_PROFILE);
    }

    try {
      const res = await fetch(getApiUrl('/api/auth/profile'), {
        headers: this.getHeaders(),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          const profile: UserProfile = {
            ...data.user,
            jobTitle: data.user.jobTitle || '',
            organization: data.user.organization || '',
            bio: data.user.bio || '',
          };
          storage.set(STORAGE_KEYS.USER_DATA, profile);
          storage.set('aura_user_profile', profile);
          return profile;
        }
      }
    } catch (err) {
      console.warn('Could not fetch remote profile, using local cache:', err);
    }

    return cachedUser || storage.get<UserProfile>('aura_user_profile', INITIAL_PROFILE);
  }

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const token = storage.get<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);

    if (token) {
      try {
        const res = await fetch(getApiUrl('/api/auth/profile'), {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        });

        const resData = await res.json();
        if (!res.ok) {
          throw new Error(resData.error || 'Failed to update profile.');
        }

        if (resData.user) {
          const updatedProfile: UserProfile = {
            ...resData.user,
            jobTitle: resData.user.jobTitle || '',
            organization: resData.user.organization || '',
            bio: resData.user.bio || '',
          };
          storage.set(STORAGE_KEYS.USER_DATA, updatedProfile);
          storage.set('aura_user_profile', updatedProfile);
          return updatedProfile;
        }
      } catch (err: any) {
        console.error('API Profile update error:', err);
        throw err;
      }
    }

    // Fallback if offline/no token
    const current = await this.getProfile();
    const updated = { ...current, ...data };
    storage.set('aura_user_profile', updated);
    storage.set(STORAGE_KEYS.USER_DATA, updated);
    return updated;
  }

  async getOllamaConfig(): Promise<OllamaConfig> {
    try {
      const res = await fetch(getApiUrl('/api/ollama/config'), {
        headers: this.getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          url: data.url || 'http://127.0.0.1:11434',
          userCustomUrl: data.userCustomUrl || '',
          connected: Boolean(data.connected),
          latencyMs: data.latencyMs,
          models: data.models || [],
          defaultModel: data.defaultModel,
          error: data.error,
        };
      }
    } catch (err) {
      console.warn('Failed to fetch ollama config:', err);
    }

    return {
      url: 'http://127.0.0.1:11434',
      connected: false,
      models: [],
      error: 'Backend unreachable',
    };
  }

  async testOllamaEndpoint(url: string): Promise<TestOllamaResult> {
    const res = await fetch(getApiUrl('/api/ollama/test'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    return {
      connected: Boolean(data.connected),
      url: data.url || url,
      latencyMs: data.latencyMs || 0,
      models: data.models || [],
      defaultModel: data.defaultModel,
      error: data.error,
    };
  }

  async updateOllamaConfig(url: string): Promise<OllamaConfig> {
    const res = await fetch(getApiUrl('/api/ollama/config'), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update Ollama configuration');
    }

    // Update user cache with new ollamaBaseUrl
    const current = await this.getProfile();
    const updated = { ...current, ollamaBaseUrl: data.url };
    storage.set(STORAGE_KEYS.USER_DATA, updated);
    storage.set('aura_user_profile', updated);

    return {
      url: data.url,
      connected: Boolean(data.connected),
      latencyMs: data.latencyMs,
      models: data.models || [],
      error: data.error,
    };
  }

  async getApiKeys(): Promise<ApiKeyItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return storage.get<ApiKeyItem[]>('aura_api_keys', INITIAL_KEYS);
  }

  async createApiKey(name: string): Promise<ApiKeyItem> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const keys = await this.getApiKeys();
    const newKey: ApiKeyItem = {
      id: generateId('key'),
      name,
      keyPreview: `sk-aura-live-••••••••${Math.random().toString(16).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newKey, ...keys];
    storage.set('aura_api_keys', updated);
    return newKey;
  }

  async deleteApiKey(id: string): Promise<void> {
    const keys = await this.getApiKeys();
    const updated = keys.filter((k) => k.id !== id);
    storage.set('aura_api_keys', updated);
  }

  getUsageMetrics(): UsageMetric[] {
    return [
      { date: 'Oct 01', tokens: 4200, requests: 12 },
      { date: 'Oct 02', tokens: 6800, requests: 18 },
      { date: 'Oct 03', tokens: 9100, requests: 25 },
      { date: 'Oct 04', tokens: 5400, requests: 14 },
      { date: 'Oct 05', tokens: 11200, requests: 31 },
      { date: 'Oct 06', tokens: 5480, requests: 16 },
    ];
  }
}

export const profileService = new ProfileService();
