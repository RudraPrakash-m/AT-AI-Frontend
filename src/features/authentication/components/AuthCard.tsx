import React from 'react';
import { Paper, Box, Typography, Stack, useTheme } from '@mui/material';
import { AutoAwesome as SparklesIcon } from '@mui/icons-material';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  children,
  footer,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        maxWidth: 440,
        p: { xs: 3, sm: 4.5 },
        borderRadius: '20px',
        bgcolor: isDark ? 'rgba(19, 27, 42, 0.8)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        boxShadow: isDark
          ? '0 20px 40px -15px rgba(0, 0, 0, 0.7)'
          : '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Stack spacing={3}>
        {/* Brand Header */}
        <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              p: 1.25,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
              color: '#ffffff',
              boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)',
            }}
          >
            <SparklesIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>

        {children}

        {footer && <Box sx={{ pt: 1 }}>{footer}</Box>}
      </Stack>
    </Paper>
  );
};
