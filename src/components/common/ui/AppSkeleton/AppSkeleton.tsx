import React from 'react';
import { Skeleton, Stack, Box } from '@mui/material';

export interface AppSkeletonProps {
  variant?: 'message' | 'history-item' | 'card' | 'line';
  count?: number;
}

export const AppSkeleton: React.FC<AppSkeletonProps> = ({
  variant = 'line',
  count = 1,
}) => {
  const renderItem = (key: number) => {
    switch (variant) {
      case 'message':
        return (
          <Stack key={key} direction="row" spacing={2} sx={{ width: '100%', py: 2 }}>
            <Skeleton variant="circular" width={36} height={36} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="20%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="60%" height={20} />
            </Box>
          </Stack>
        );
      case 'history-item':
        return (
          <Stack key={key} direction="row" spacing={1.5} sx={{ alignItems: 'center', py: 1, px: 1.5 }}>
            <Skeleton variant="rounded" width={20} height={20} />
            <Skeleton variant="text" width="75%" height={22} />
          </Stack>
        );
      case 'card':
        return (
          <Box
            key={key}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              width: '100%',
            }}
          >
            <Skeleton variant="text" width="40%" height={26} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={18} />
            <Skeleton variant="text" width="85%" height={18} />
          </Box>
        );
      case 'line':
      default:
        return <Skeleton key={key} variant="text" width="100%" height={24} />;
    }
  };

  return (
    <Stack spacing={1.5} sx={{ width: '100%' }}>
      {Array.from({ length: count }).map((_, i) => renderItem(i))}
    </Stack>
  );
};
