import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  PaletteOutlined as AppearanceIcon,
  PsychologyOutlined as ModelIcon,
  TuneOutlined as GeneralIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material';
import { PageContainer } from '@/components/common/layout/PageContainer';
import { ScrollContainer } from '@/components/common/layout/ScrollContainer';
import { ResponsiveContainer } from '@/components/common/layout/ResponsiveContainer';
import { AppButton } from '@/components/common/ui/AppButton';
import { useSettings } from '../hooks/useSettings';
import { AppearanceSettings } from '../components/AppearanceSettings';
import { ModelSettings } from '../components/ModelSettings';
import { GeneralSettings } from '../components/GeneralSettings';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [toastOpen, setToastOpen] = useState(false);
  const { settings, updateSetting, resetAllSettings } = useSettings();

  const handleReset = () => {
    resetAllSettings();
    setToastOpen(true);
  };

  return (
    <PageContainer>
      <ScrollContainer>
        <ResponsiveContainer maxWidth="md" sx={{ py: 4 }}>
          {/* Header */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Workspace Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Configure application aesthetics, intelligence parameters, and generation controls.
              </Typography>
            </Box>

            <AppButton
              variant="outlined"
              color="inherit"
              startIcon={<ResetIcon />}
              onClick={handleReset}
            >
              Reset to Defaults
            </AppButton>
          </Stack>

          {/* Settings Tabs */}
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            sx={{
              mb: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                minHeight: 48,
              },
            }}
          >
            <Tab icon={<AppearanceIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Appearance" />
            <Tab icon={<ModelIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Models & AI" />
            <Tab icon={<GeneralIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="General" />
          </Tabs>

          {/* Active Tab Panels */}
          {activeTab === 0 && (
            <AppearanceSettings settings={settings} onUpdate={updateSetting} />
          )}

          {activeTab === 1 && (
            <ModelSettings settings={settings} onUpdate={updateSetting} />
          )}

          {activeTab === 2 && (
            <GeneralSettings settings={settings} onUpdate={updateSetting} />
          )}

          <Snackbar
            open={toastOpen}
            autoHideDuration={3000}
            onClose={() => setToastOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert severity="info" sx={{ borderRadius: '10px' }}>
              Settings have been reset to factory defaults.
            </Alert>
          </Snackbar>
        </ResponsiveContainer>
      </ScrollContainer>
    </PageContainer>
  );
};
