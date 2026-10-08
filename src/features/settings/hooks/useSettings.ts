import { useState, useCallback } from 'react';
import { useThemeMode } from '@/theme/ThemeContext';
import type { UserSettings } from '../types/settings.types';
import { settingsService } from '../services/settings.service';

export const useSettings = () => {
  const { mode, setMode } = useThemeMode();
  const [settings, setSettingsState] = useState<UserSettings>(() => {
    const saved = settingsService.getSettings();
    return { ...saved, themeMode: mode };
  });

  const updateSetting = useCallback(
    <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
      setSettingsState((prev) => {
        const next = { ...prev, [key]: value };
        settingsService.saveSettings(next);
        if (key === 'themeMode') {
          setMode(value as 'light' | 'dark' | 'system');
        }
        return next;
      });
    },
    [setMode]
  );

  const resetAllSettings = useCallback(() => {
    const defaults = settingsService.resetSettings();
    setSettingsState(defaults);
    setMode(defaults.themeMode);
  }, [setMode]);

  return {
    settings,
    updateSetting,
    resetAllSettings,
  };
};
