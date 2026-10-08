import React from 'react';
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
} from '@mui/icons-material';
import { AppTooltip } from '@/components/common/ui/AppTooltip';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        height: 56,
        px: { xs: 1.5, sm: 2.5 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: isDark ? 'rgba(11, 15, 23, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 10,
        width: '100%',
      }}
    >
      {/* Left side: Mobile menu toggle + Model selector */}
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        {isMobile && (
          <IconButton
            size="small"
            onClick={onOpenMobileMenu}
            aria-label="open navigation menu"
            sx={{ color: 'text.secondary' }}
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

      {/* Middle: Conversation Title (if desktop) */}
      {conversationTitle && !isMobile && (
        <Typography
          variant="subtitle2"
          noWrap
          sx={{ fontWeight: 600, color: 'text.secondary', maxWidth: 360, textAlign: 'center' }}
        >
          {conversationTitle}
        </Typography>
      )}

      {/* Right side: Action buttons */}
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        <AppTooltip title="Start New Conversation">
          <IconButton
            size="small"
            onClick={onNewChat}
            sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </AppTooltip>

        <AppTooltip title="Model Parameters & Presets">
          <IconButton
            size="small"
            onClick={onOpenSettingsModal}
            sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
          >
            <TuneIcon fontSize="small" />
          </IconButton>
        </AppTooltip>
      </Stack>
    </Box>
  );
};
