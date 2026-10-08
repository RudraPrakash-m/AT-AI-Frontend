import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { WarningAmber as WarningIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { AppButton } from '@/components/common/ui/AppButton';

interface ErrorPageProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ error, resetErrorBoundary }) => {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        textAlign: 'center',
      }}
    >
      <Stack spacing={2.5} sx={{ alignItems: 'center', maxWidth: 480 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: '50%',
            bgcolor: 'action.hover',
            color: 'error.main',
          }}
        >
          <WarningIcon sx={{ fontSize: 56 }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Something went wrong
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error?.message || 'An unexpected client runtime exception occurred in the application.'}
        </Typography>
        <AppButton
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={resetErrorBoundary ? resetErrorBoundary : () => window.location.reload()}
          sx={{ mt: 1 }}
        >
          Reload Application
        </AppButton>
      </Stack>
    </Box>
  );
};
