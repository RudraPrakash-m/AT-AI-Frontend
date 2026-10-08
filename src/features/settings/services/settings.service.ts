import { STORAGE_KEYS } from '@/constants';
import { storage } from '@/utils/storage.utils';
import type { UserSettings } from '../types/settings.types';

const DEFAULT_SETTINGS: UserSettings = {
  themeMode: 'dark',
  fontSize: 'medium',
  sendOnEnter: true,
  codeHighlighting: true,
  streamResponses: true,
  defaultModel: 'aura-4o',
  temperature: 0.7,
  topP: 0.95,
  systemPrompt: 'You are AT AI, an expert technical collaborator and software architect. Provide clear, concise, and production-ready responses with code examples.',
  enableTelemetry: true,
  enableMemory: true,
  soundEffects: false,
};

class SettingsService {
  getSettings(): UserSettings {
    return storage.get<UserSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  saveSettings(settings: UserSettings): UserSettings {
    storage.set(STORAGE_KEYS.SETTINGS, settings);
    return settings;
  }

  resetSettings(): UserSettings {
    storage.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
}

export const settingsService = new SettingsService();
