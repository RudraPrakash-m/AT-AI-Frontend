import React from 'react';
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AutoAwesome as SparklesIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { AppTooltip } from '@/components/common/ui/AppTooltip';
import { useThemeMode } from '@/theme/ThemeContext';

interface HeaderProps {
  onOpenMobileNav: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav, title = 'AT AI' }) => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Box
      component="header"
      sx={{
        height: 56,
        px: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5 }}>
        <IconButton
          size="small"
          onClick={onOpenMobileNav}
          sx={{ display: { md: 'none' }, color: 'text.secondary' }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
          <SparklesIcon sx={{ fontSize: 20, color: 'primary.main' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
        <AppTooltip title="Toggle Theme">
          <IconButton size="small" onClick={toggleTheme} sx={{ color: 'text.secondary' }}>
            {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
        </AppTooltip>
      </Box>
    </Box>
  );
};
