import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Stack,
  Snackbar,
  Alert,
  IconButton,
  Button,
  Chip,
  useTheme,
} from '@mui/material';
import {
  PaletteOutlined as AppearanceIcon,
  PsychologyOutlined as ModelIcon,
  TuneOutlined as GeneralIcon,
  RestartAlt as ResetIcon,
  ArrowBack as BackIcon,
  CheckCircleOutlined as SavedIcon,
  PersonOutlined as ProfileIcon,
} from '@mui/icons-material';
import { PageContainer } from '@/components/common/layout/PageContainer';
import { ScrollContainer } from '@/components/common/layout/ScrollContainer';
import { ResponsiveContainer } from '@/components/common/layout/ResponsiveContainer';
import { AppTooltip } from '@/components/common/ui/AppTooltip';
import { useSettings } from '../hooks/useSettings';
import { AppearanceSettings } from '../components/AppearanceSettings';
import { ModelSettings } from '../components/ModelSettings';
import { GeneralSettings } from '../components/GeneralSettings';

interface SettingsTabItem {
  id: number;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const SETTINGS_TABS: SettingsTabItem[] = [
  {
    id: 0,
    label: 'Appearance',
    description: 'Theme, typography & syntax',
    icon: <AppearanceIcon sx={{ fontSize: 20 }} />,
  },
  {
    id: 1,
    label: 'Models & Intelligence',
    description: 'Default LLM, temperature & prompt',
    icon: <ModelIcon sx={{ fontSize: 20 }} />,
  },
  {
    id: 2,
    label: 'General Preferences',
    description: 'Streaming, memory & shortcuts',
    icon: <GeneralIcon sx={{ fontSize: 20 }} />,
  },
];

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
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
        <ResponsiveContainer maxWidth="lg" sx={{ py: { xs: 2, sm: 3.5 }, px: { xs: 1.5, sm: 3 } }}>
          {/* Top Navigation Bar: Back button + Page Title + Live Save Badge */}
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: { xs: 2.5, sm: 3.5 },
              pb: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <AppTooltip title="Back to Chat">
                <IconButton
                  onClick={() => navigate('/chat')}
                  size="small"
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '12px',
                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                    '&:hover': {
                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                    },
                  }}
                >
                  <BackIcon fontSize="small" />
                </IconButton>
              </AppTooltip>

              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    color: 'text.primary',
                  }}
                >
                  Workspace Settings
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  Personalize your AT AI workspace environment, model defaults, and intelligence parameters.
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Chip
                icon={<SavedIcon sx={{ fontSize: '15px !important', color: '#10B981' }} />}
                label="Auto-saved"
                size="small"
                variant="outlined"
                sx={{
                  borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.4)',
                  color: isDark ? '#6EE7B7' : '#047857',
                  bgcolor: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.06)',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  display: { xs: 'none', sm: 'inline-flex' },
                }}
              />

              <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<ResetIcon sx={{ fontSize: 16 }} />}
                onClick={handleReset}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  borderColor: 'divider',
                  color: 'text.secondary',
                  '&:hover': { borderColor: 'text.primary', color: 'text.primary' },
                }}
              >
                Reset
              </Button>
            </Stack>
          </Stack>

          {/* Master-Detail 2-Column Layout */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 2.5, md: 3.5 },
              alignItems: 'flex-start',
            }}
          >
            {/* Left Column: Navigation Sidebar */}
            <Box
              sx={{
                width: { xs: '100%', md: 260 },
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {SETTINGS_TABS.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                  <Box
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: '14px',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: isActive
                        ? 'primary.main'
                        : isDark
                        ? 'rgba(255, 255, 255, 0.06)'
                        : 'rgba(0, 0, 0, 0.06)',
                      bgcolor: isActive
                        ? isDark
                          ? 'rgba(37, 99, 235, 0.12)'
                          : 'rgba(37, 99, 235, 0.08)'
                        : isDark
                        ? 'rgba(19, 27, 42, 0.4)'
                        : 'rgba(255, 255, 255, 0.7)',
                      color: isActive ? 'primary.main' : 'text.primary',
                      transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        bgcolor: isActive
                          ? isDark
                            ? 'rgba(37, 99, 235, 0.16)'
                            : 'rgba(37, 99, 235, 0.1)'
                          : isDark
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.04)',
                        transform: 'translateX(2px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: isActive
                          ? 'primary.main'
                          : isDark
                          ? 'rgba(255, 255, 255, 0.06)'
                          : 'rgba(0, 0, 0, 0.05)',
                        color: isActive ? '#FFFFFF' : 'text.secondary',
                      }}
                    >
                      {tab.icon}
                    </Box>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                        {tab.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{ display: 'block', fontSize: '0.72rem' }}
                      >
                        {tab.description}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}

              {/* Quick Profile Link Card */}
              <Box
                onClick={() => navigate('/profile')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  mt: 1,
                  borderRadius: '14px',
                  cursor: 'pointer',
                  border: '1px dashed',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.15)',
                  bgcolor: 'transparent',
                  color: 'text.secondary',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    bgcolor: isDark ? 'rgba(37, 99, 235, 0.06)' : 'rgba(37, 99, 235, 0.04)',
                  },
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <ProfileIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    Profile & Account
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                    Manage account details & plan
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Right Column: Settings Form Panels */}
            <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
              {activeTab === 0 && (
                <AppearanceSettings settings={settings} onUpdate={updateSetting} />
              )}

              {activeTab === 1 && (
                <ModelSettings settings={settings} onUpdate={updateSetting} />
              )}

              {activeTab === 2 && (
                <GeneralSettings settings={settings} onUpdate={updateSetting} />
              )}
            </Box>
          </Box>

          <Snackbar
            open={toastOpen}
            autoHideDuration={3000}
            onClose={() => setToastOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert severity="info" sx={{ borderRadius: '12px' }}>
              Settings have been reset to factory defaults.
            </Alert>
          </Snackbar>
        </ResponsiveContainer>
      </ScrollContainer>
    </PageContainer>
  );
};

