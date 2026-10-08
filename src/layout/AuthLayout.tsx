import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';

export const AuthLayout: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
        bgcolor: isDark ? '#070D18' : '#F8FAFC',
        p: { xs: 1.5, sm: 3, md: 4 },
        py: { xs: 2.5, sm: 4 },
        boxSizing: 'border-box',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: '-15%',
          left: '20%',
          width: { xs: '350px', sm: '500px', md: '650px' },
          height: { xs: '350px', sm: '500px', md: '650px' },
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(0, 163, 255, 0.15) 0%, rgba(245, 158, 11, 0.05) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(2, 132, 199, 0.1) 0%, rgba(245, 158, 11, 0.04) 50%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)',
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Outlet />
      </Box>
    </Box>
  );
};
