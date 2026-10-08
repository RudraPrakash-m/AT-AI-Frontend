import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  PersonOutlined as AccountIcon,
  DataUsage as UsageIcon,
  CloudQueue as CloudTunnelIcon,
} from '@mui/icons-material';
import { PageContainer } from '@/components/common/layout/PageContainer';
import { ScrollContainer } from '@/components/common/layout/ScrollContainer';
import { ResponsiveContainer } from '@/components/common/layout/ResponsiveContainer';
import { useProfile } from '../hooks/useProfile';
import { ProfileDetails } from '../components/ProfileDetails';
import { UsageStatistics } from '../components/UsageStatistics';
import { OllamaConfigManager } from '../components/OllamaConfigManager';

export const ProfilePage: React.FC = () => {
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
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ScrollContainer>
        <ResponsiveContainer maxWidth="md" sx={{ py: 4 }}>
          {/* Page Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Account & Subscription
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Manage personal credentials, Cloudflare Tunnel / Ollama AI endpoints, and usage limits.
            </Typography>
          </Box>

          {/* Profile Tabs */}
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
            <Tab icon={<AccountIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Profile" />
            <Tab icon={<UsageIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Usage & Quota" />
            <Tab icon={<CloudTunnelIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Cloudflare / Ollama URL" />
          </Tabs>

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
