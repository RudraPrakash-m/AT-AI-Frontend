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
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Usage & Quotas
          </Typography>
          <Chip
            icon={<PlanIcon sx={{ fontSize: '16px !important' }} />}
            label={`${profile.plan} Plan Active`}
            color="primary"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Track real-time token utilization and query metrics across your enterprise workspace.
        </Typography>

        {/* Token Progress Bar */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: '12px',
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
            border: '1px solid',
            borderColor: 'divider',
            mb: 3,
          }}
        >
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <TokenIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Monthly Token Quota
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {used.toLocaleString()} / {limit.toLocaleString()} ({percentUsed}%)
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={percentUsed}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: 'divider',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
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
