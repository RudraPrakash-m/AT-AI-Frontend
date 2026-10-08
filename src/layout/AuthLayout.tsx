import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, IconButton, useTheme } from '@mui/material';
import {
  DarkModeOutlined as DarkModeIcon,
  LightModeOutlined as LightModeIcon,
} from '@mui/icons-material';
import { AppTooltip } from '@/components/common/ui/AppTooltip';
import { useThemeMode } from '@/theme/ThemeContext';

export const AuthLayout: React.FC = () => {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: isDark ? '#080C14' : '#F1F5F9',
        p: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-15%',
          left: '20%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(37, 99, 235, 0.18) 0%, rgba(124, 58, 237, 0.05) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(124, 58, 237, 0.04) 50%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
        },
      }}
    >
      {/* Top right theme toggle */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <AppTooltip title="Toggle Theme">
          <IconButton onClick={toggleTheme} sx={{ color: 'text.secondary' }}>
            {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
        </AppTooltip>
      </Box>

      <Outlet />
    </Box>
  );
};
