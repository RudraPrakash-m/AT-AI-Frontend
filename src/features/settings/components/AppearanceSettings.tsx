import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Paper,
  Box,
  Switch,
  Divider,
} from '@mui/material';
import {
  DarkMode as DarkIcon,
  LightMode as LightIcon,
  SettingsBrightness as SystemIcon,
} from '@mui/icons-material';
import type { UserSettings } from '../types/settings.types';

interface AppearanceSettingsProps {
  settings: UserSettings;
  onUpdate: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
}

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  settings,
  onUpdate,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
          Appearance & Theme
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Customize the aesthetic theme, typography scale, and layout density of your workspace.
        </Typography>

        {/* Theme mode selector */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
          Color Mode
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          {[
            { id: 'dark', label: 'Dark Mode', icon: <DarkIcon sx={{ fontSize: 20 }} />, desc: 'Deep graphite & indigo' },
            { id: 'light', label: 'Light Mode', icon: <LightIcon sx={{ fontSize: 20 }} />, desc: 'Clean crisp canvas' },
            { id: 'system', label: 'System', icon: <SystemIcon sx={{ fontSize: 20 }} />, desc: 'Syncs with OS settings' },
          ].map((modeOption) => {
            const isSelected = settings.themeMode === modeOption.id;

            return (
              <Paper
                key={modeOption.id}
                elevation={0}
                onClick={() => onUpdate('themeMode', modeOption.id as UserSettings['themeMode'])}
                sx={{
                  flex: 1,
                  p: 2,
                  cursor: 'pointer',
                  borderRadius: '12px',
                  border: '2px solid',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  bgcolor: isSelected ? 'action.selected' : 'transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: isSelected ? 'primary.main' : 'text.disabled',
                  },
                }}
              >
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, color: isSelected ? 'primary.main' : 'text.secondary' }}>
                    {modeOption.icon}
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {modeOption.label}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {modeOption.desc}
                  </Typography>
                </Stack>
              </Paper>
            );
          })}
        </Stack>

        <Divider sx={{ my: 2.5 }} />

        {/* Code highlighting */}
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Syntax Highlighting
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Render rich syntax themes with copy action shortcuts for all markdown code blocks.
            </Typography>
          </Box>
          <Switch
            checked={settings.codeHighlighting}
            onChange={(e) => onUpdate('codeHighlighting', e.target.checked)}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
