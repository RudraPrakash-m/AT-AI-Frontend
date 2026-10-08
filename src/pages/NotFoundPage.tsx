import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Stack } from '@mui/material';
import { ErrorOutlined as NotFoundIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { AppButton } from '@/components/common/ui/AppButton';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

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
      <Stack spacing={2.5} sx={{ alignItems: 'center', maxWidth: 440 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: '50%',
            bgcolor: 'action.hover',
            color: 'primary.main',
          }}
        >
          <NotFoundIcon sx={{ fontSize: 56 }} />
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary' }}>
          404
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Page Not Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The requested page or conversation thread could not be found or has been permanently moved.
        </Typography>
        <AppButton
          variant="contained"
          startIcon={<BackIcon />}
          onClick={() => navigate('/chat')}
          sx={{ mt: 1 }}
        >
          Return to Workspace
        </AppButton>
      </Stack>
    </Box>
  );
};
