import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  LinearProgress,
  Grid,
  Box,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Token as TokenIcon,
  Bolt as RequestIcon,
  WorkspacePremium as PlanIcon,
} from '@mui/icons-material';
import type { UserProfile, UsageMetric } from '../types/profile.types';

interface UsageStatisticsProps {
  profile: UserProfile;
  metrics: UsageMetric[];
}

export const UsageStatistics: React.FC<UsageStatisticsProps> = ({ profile, metrics }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const used = profile.tokensUsed;
  const limit = profile.tokenLimit;
  const percentUsed = Math.min(100, Math.round((used / limit) * 100));

  const totalWeeklyTokens = metrics.reduce((acc, m) => acc + m.tokens, 0);
  const totalWeeklyRequests = metrics.reduce((acc, m) => acc + m.requests, 0);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: { xs: '14px', sm: '16px' },
        border: '1px solid',
        borderColor: isDark ? 'rgba(0, 163, 255, 0.16)' : 'rgba(2, 132, 199, 0.14)',
        bgcolor: isDark ? '#0C1424' : '#FFFFFF',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.75, md: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 1.5,
            mb: 1.5,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1.05rem', sm: '1.2rem' } }}>
            Usage & Quotas
          </Typography>
          <Chip
            icon={<PlanIcon sx={{ fontSize: '15px !important', color: '#FFFFFF !important' }} />}
            label={`${profile.plan} Plan Active`}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.74rem',
              background: 'linear-gradient(135deg, #00A3FF 0%, #0284C7 100%)',
              color: '#FFFFFF',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 163, 255, 0.3)',
              alignSelf: { xs: 'flex-start', sm: 'auto' },
            }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
          Track real-time token utilization and query metrics across your enterprise workspace.
        </Typography>

        {/* Token Progress Bar */}
        <Box
          sx={{
            p: { xs: 1.75, sm: 2.5 },
            borderRadius: '12px',
            bgcolor: isDark ? 'rgba(0, 163, 255, 0.05)' : 'rgba(2, 132, 199, 0.03)',
            border: '1px solid',
            borderColor: isDark ? 'rgba(0, 163, 255, 0.14)' : 'rgba(2, 132, 199, 0.12)',
            mb: 2.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 0.5,
              mb: 1.25,
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <TokenIcon sx={{ color: 'primary.main', fontSize: 18 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                Monthly Token Quota
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main', fontSize: { xs: '0.82rem', sm: '0.88rem' } }}>
              {used.toLocaleString()} / {limit.toLocaleString()} ({percentUsed}%)
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={percentUsed}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(90deg, #00A3FF 0%, #F59E0B 100%)',
              },
            }}
          />
        </Box>

        {/* Summary Metric Cards */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '8px',
                    bgcolor: 'action.selected',
                    color: 'primary.main',
                  }}
                >
                  <TokenIcon />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Weekly Tokens Burned
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {totalWeeklyTokens.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '8px',
                    bgcolor: 'action.selected',
                    color: '#10B981',
                  }}
                >
                  <RequestIcon />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Prompts & Computations
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {totalWeeklyRequests.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
