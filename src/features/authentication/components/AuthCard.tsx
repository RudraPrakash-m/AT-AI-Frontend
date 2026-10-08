import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Box, Typography, Stack, IconButton, useTheme } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  DarkModeOutlined as DarkModeIcon,
  LightModeOutlined as LightModeIcon,
} from '@mui/icons-material';
import { AppTooltip } from '@/components/common/ui/AppTooltip';
import { useThemeMode } from '@/theme/ThemeContext';
import aashditLogo from '@/assets/aashditLogo-removebg-preview.png';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onBack?: () => void;
  backTo?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  children,
  footer,
  onBack,
  backTo,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const isDark = theme.palette.mode === 'dark';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backTo) {
      navigate(backTo);
    }
  };

  const showBackButton = Boolean(onBack || backTo);

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: { xs: '100%', sm: 420, md: 430 },
        mx: 'auto',
        p: { xs: 2, sm: 2.75, md: 3 },
        borderRadius: { xs: '14px', sm: '18px' },
        bgcolor: isDark ? '#0F192C' : '#FFFFFF',
        border: '1px solid',
        borderColor: isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0, 0, 0, 0.08)',
        boxShadow: isDark
          ? '0 16px 40px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0, 163, 255, 0.08)'
          : '0 16px 40px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Top Left Back Button */}
      {showBackButton && (
        <AppTooltip title="Go back">
          <IconButton
            onClick={handleBack}
            size="small"
            aria-label="go back"
            sx={{
              position: 'absolute',
              top: { xs: 10, sm: 12 },
              left: { xs: 10, sm: 12 },
              color: 'text.secondary',
              width: 32,
              height: 32,
              borderRadius: '8px',
              '&:hover': {
                color: 'text.primary',
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
              },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </AppTooltip>
      )}

      {/* Top Right Theme Toggle */}
      <AppTooltip title={mode === 'dark' ? 'Switch to Light' : 'Switch to Dark'}>
        <IconButton
          onClick={toggleTheme}
          size="small"
          aria-label="toggle theme"
          sx={{
            position: 'absolute',
            top: { xs: 10, sm: 12 },
            right: { xs: 10, sm: 12 },
            color: 'text.secondary',
            width: 32,
            height: 32,
            borderRadius: '8px',
            '&:hover': {
              color: 'text.primary',
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          {mode === 'dark' ? <LightModeIcon sx={{ fontSize: 18 }} /> : <DarkModeIcon sx={{ fontSize: 18 }} />}
        </IconButton>
      </AppTooltip>

      <Stack spacing={{ xs: 1.75, sm: 2 }}>
        {/* Brand Header */}
        <Stack spacing={0.75} sx={{ alignItems: 'center', textAlign: 'center', pt: 0.5 }}>
          <Box
            component="img"
            src={aashditLogo}
            alt="Aashdit Logo"
            sx={{
              width: { xs: 38, sm: 44 },
              height: { xs: 38, sm: 44 },
              objectFit: 'contain',
              filter: isDark ? 'drop-shadow(0 4px 10px rgba(0, 163, 255, 0.35))' : 'drop-shadow(0 4px 10px rgba(2, 132, 199, 0.15))',
            }}
          />
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: { xs: '1.15rem', sm: '1.28rem' },
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.25,
                  fontSize: { xs: '0.78rem', sm: '0.82rem' },
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>

        {children}

        {footer && <Box sx={{ pt: 0.25 }}>{footer}</Box>}
      </Stack>
    </Paper>
  );
};

