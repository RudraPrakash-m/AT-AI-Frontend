import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  TuneOutlined as TuneIcon,
  Add as AddIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { AppTooltip } from '@/components/common/ui/AppTooltip';
import { useThemeMode } from '@/theme/ThemeContext';
import { ModelSelector } from './ModelSelector';

interface ChatHeaderProps {
  conversationTitle?: string;
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
  onNewChat: () => void;
  onOpenMobileMenu?: () => void;
  onOpenSettingsModal?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversationTitle,
  selectedModelId,
  onModelChange,
  onNewChat,
  onOpenMobileMenu,
  onOpenSettingsModal,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';

  const handleSettingsClick = () => {
    if (onOpenSettingsModal) {
      onOpenSettingsModal();
    } else {
      navigate('/settings');
    }
  };

  return (
    <Box
      sx={{
        height: { xs: 52, sm: 56 },
        px: { xs: 1, sm: 2, md: 2.5 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: isDark ? 'rgba(7, 13, 24, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 10,
        width: '100%',
        gap: 1,
      }}
    >
      {/* Left side: Mobile menu toggle + Model selector */}
      <Stack direction="row" spacing={{ xs: 0.75, sm: 1.5 }} sx={{ alignItems: 'center', minWidth: 0 }}>
        {isMobile && (
          <IconButton
            size="small"
            onClick={onOpenMobileMenu}
            aria-label="open navigation menu"
            sx={{
              color: 'text.secondary',
              width: 36,
              height: 36,
              flexShrink: 0,
              '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
        )}

        <ModelSelector
          selectedModelId={selectedModelId}
          onModelChange={onModelChange}
          size="small"
        />
      </Stack>

      {/* Middle: Conversation Title (if desktop/tablet) */}
      {conversationTitle && (
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            px: 1.5,
            minWidth: 0,
          }}
        >
          <Typography
            variant="subtitle2"
            noWrap
            sx={{
              fontWeight: 600,
              color: 'text.secondary',
              maxWidth: { md: 260, lg: 400 },
              textAlign: 'center',
            }}
          >
            {conversationTitle}
          </Typography>
        </Box>
      )}

      {/* Right side: Action buttons - clean and uncluttered on mobile */}
      <Stack direction="row" spacing={{ xs: 0.5, sm: 0.75 }} sx={{ alignItems: 'center', flexShrink: 0 }}>
        <AppTooltip title="Start New Conversation">
          <IconButton
            size="small"
            onClick={onNewChat}
            aria-label="start new conversation"
            sx={{
              color: 'text.secondary',
              width: 36,
              height: 36,
              '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </AppTooltip>

        <AppTooltip title="Model Parameters & Settings">
          <IconButton
            size="small"
            onClick={handleSettingsClick}
            aria-label="settings"
            sx={{
              color: 'text.secondary',
              width: 36,
              height: 36,
              display: { xs: 'none', sm: 'inline-flex' },
              '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
            }}
          >
            <TuneIcon fontSize="small" />
          </IconButton>
        </AppTooltip>

        <AppTooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <IconButton
            size="small"
            onClick={toggleTheme}
            aria-label="toggle theme"
            sx={{
              color: 'text.secondary',
              width: 36,
              height: 36,
              display: { xs: 'none', sm: 'inline-flex' },
              '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
            }}
          >
            {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
        </AppTooltip>
      </Stack>
    </Box>
  );
};

