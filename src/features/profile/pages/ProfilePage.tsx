import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PersonOutlined as AccountIcon,
  DataUsage as UsageIcon,
  CloudQueue as CloudTunnelIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { PageContainer } from '@/components/common/layout/PageContainer';
import { ScrollContainer } from '@/components/common/layout/ScrollContainer';
import { ResponsiveContainer } from '@/components/common/layout/ResponsiveContainer';
import { AppTooltip } from '@/components/common/ui/AppTooltip';
import { useProfile } from '../hooks/useProfile';
import { ProfileDetails } from '../components/ProfileDetails';
import { UsageStatistics } from '../components/UsageStatistics';
import { OllamaConfigManager } from '../components/OllamaConfigManager';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  const [activeTab, setActiveTab] = useState(0);

  const {
    profile,
    usageMetrics,
    isLoading,
    updateProfile,
  } = useProfile();

  if (isLoading || !profile) {
    return (
      <PageContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <CircularProgress size={32} />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ScrollContainer>
        <ResponsiveContainer maxWidth="md" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1.5, sm: 2.5, md: 3 } }}>
          {/* Page Header with Back Button */}
          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.5 }}>
              <AppTooltip title="Back to Chat">
                <IconButton
                  onClick={() => navigate('/chat')}
                  size="small"
                  aria-label="Back to chat"
                  sx={{
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(0, 163, 255, 0.2)' : 'rgba(2, 132, 199, 0.16)',
                    bgcolor: isDark ? 'rgba(0, 163, 255, 0.06)' : 'rgba(2, 132, 199, 0.04)',
                    color: 'text.secondary',
                    p: 0.75,
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: isDark ? 'rgba(0, 163, 255, 0.12)' : 'rgba(2, 132, 199, 0.08)',
                    },
                  }}
                >
                  <BackIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </AppTooltip>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.25rem', sm: '1.65rem', md: '1.9rem' },
                  letterSpacing: '-0.02em',
                  color: 'text.primary',
                }}
              >
                Account & Subscription
              </Typography>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.78rem', sm: '0.85rem' },
                lineHeight: 1.45,
                pl: { xs: 0, sm: 4.75 },
              }}
            >
              Manage personal credentials, Cloudflare Tunnel / Ollama AI endpoints, and usage limits.
            </Typography>
          </Box>

          {/* Profile Tabs - Scrollable and responsive without clipping */}
          <Box
            sx={{
              mb: { xs: 2, sm: 3 },
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, val) => setActiveTab(val)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                minHeight: { xs: 42, sm: 48 },
                '& .MuiTabs-scrollButtons': {
                  color: 'text.secondary',
                  width: 28,
                  '&.Mui-disabled': { opacity: 0.3 },
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: { xs: '0.82rem', sm: '0.88rem' },
                  minHeight: { xs: 42, sm: 48 },
                  minWidth: { xs: 'auto', sm: 120 },
                  px: { xs: 1.5, sm: 2 },
                  py: 1,
                  gap: 0.75,
                  transition: 'all 0.15s ease',
                  '&.Mui-selected': {
                    color: 'primary.main',
                    fontWeight: 700,
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
              <Tab
                icon={<AccountIcon sx={{ fontSize: { xs: 17, sm: 19 } }} />}
                iconPosition="start"
                label="Profile"
              />
              <Tab
                icon={<UsageIcon sx={{ fontSize: { xs: 17, sm: 19 } }} />}
                iconPosition="start"
                label={isMobile ? "Usage" : "Usage & Quota"}
              />
              <Tab
                icon={<CloudTunnelIcon sx={{ fontSize: { xs: 17, sm: 19 } }} />}
                iconPosition="start"
                label={isMobile ? "Ollama Tunnel" : "Cloudflare / Ollama URL"}
              />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <ProfileDetails profile={profile} onUpdate={updateProfile} />
          )}

          {activeTab === 1 && (
            <UsageStatistics profile={profile} metrics={usageMetrics} />
          )}

          {activeTab === 2 && (
            <OllamaConfigManager />
          )}
        </ResponsiveContainer>
      </ScrollContainer>
    </PageContainer>
  );
};
