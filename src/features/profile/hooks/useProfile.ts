import { useState, useEffect, useCallback } from 'react';
import type { UserProfile, ApiKeyItem, UsageMetric } from '../types/profile.types';
import { profileService } from '../services/profile.service';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const [prof, keys] = await Promise.all([
        profileService.getProfile(),
        profileService.getApiKeys(),
      ]);
      setProfile(prof);
      setApiKeys(keys);
      setUsageMetrics(profileService.getUsageMetrics());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    const updated = await profileService.updateProfile(data);
    setProfile(updated);
    return updated;
  }, []);

  const createApiKey = useCallback(async (name: string) => {
    const newKey = await profileService.createApiKey(name);
    setApiKeys((prev) => [newKey, ...prev]);
    return newKey;
  }, []);

  const deleteApiKey = useCallback(async (id: string) => {
    await profileService.deleteApiKey(id);
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
  }, []);

  return {
    profile,
    apiKeys,
    usageMetrics,
    isLoading,
    updateProfile,
    createApiKey,
    deleteApiKey,
    refreshProfile: loadProfile,
  };
};
