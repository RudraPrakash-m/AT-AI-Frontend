import { STORAGE_KEYS } from '@/constants';
import { storage } from '@/utils/storage.utils';
import { generateId } from '@/utils/string.utils';
import type { UserProfile, ApiKeyItem, UsageMetric } from '../types/profile.types';

const INITIAL_PROFILE: UserProfile = {
  id: 'usr_prod_aura_99',
  name: 'Rudra Prakash Mallick',
  email: 'rudra@atai.com',
  plan: 'Pro',
  tokensUsed: 42180,
  tokenLimit: 500000,
  jobTitle: 'Lead Software Architect',
  organization: 'AT AI Technologies',
  bio: 'Building next-generation full-stack intelligent agent platforms.',
  createdAt: '2026-01-15T09:30:00.000Z',
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
  async getProfile(): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return storage.get<UserProfile>('aura_user_profile', INITIAL_PROFILE);
  }

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const current = await this.getProfile();
    const updated = { ...current, ...data };
    storage.set('aura_user_profile', updated);
    storage.set(STORAGE_KEYS.USER_DATA, updated);
    return updated;
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
