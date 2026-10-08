import React from 'react';
import { Box, CircularProgress, Typography, Stack, type BoxProps } from '@mui/material';

export interface AppLoaderProps extends BoxProps {
  message?: string;
  size?: number;
  fullScreen?: boolean;
}

export const AppLoader: React.FC<AppLoaderProps> = ({
  message = 'Loading AT AI...',
  size = 40,
  fullScreen = false,
  sx,
  ...props
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: fullScreen ? '100vh' : '100%',
        minHeight: fullScreen ? '100vh' : 240,
        p: 3,
        ...sx,
      }}
      {...props}
    >
      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <CircularProgress
          size={size}
          thickness={4}
          sx={{
            color: 'primary.main',
            filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))',
          }}
        />
        {message && (
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {message}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
