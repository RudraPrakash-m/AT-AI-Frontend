import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Typography,
  Chip,
  Box,
  useTheme,
  alpha,
  Divider,
} from '@mui/material';
import {
  KeyboardArrowDown as ArrowDownIcon,
  AutoAwesome as SparklesIcon,
  Check as CheckIcon,
  Bolt as FlashIcon,
  VisibilityOutlined as VisionIcon,
  PsychologyOutlined as ReasoningIcon,
} from '@mui/icons-material';
import { AVAILABLE_MODELS } from '@/constants';
import type { ModelOption } from '@/types';

interface ModelSelectorProps {
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
  size?: 'small' | 'medium';
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModelId,
  onModelChange,
  size = 'small',
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const open = Boolean(anchorEl);

  const currentModel =
    AVAILABLE_MODELS.find((m) => m.id === selectedModelId) || AVAILABLE_MODELS[0];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (model: ModelOption) => {
    onModelChange(model.id);
    handleClose();
  };

  const getModelDetails = (modelId: string, badge: string) => {
    if (modelId.includes('vision') || badge === 'Vision') {
      return {
        icon: <VisionIcon sx={{ fontSize: 16 }} />,
        color: '#10B981',
        bg: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
        subtitle: 'Multimodal vision & image analysis',
      };
    }
    if (modelId.includes('qwen') || badge === 'Reasoning') {
      return {
        icon: <ReasoningIcon sx={{ fontSize: 16 }} />,
        color: '#F59E0B',
        bg: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
        subtitle: 'Advanced reasoning, coding & math',
      };
    }
    return {
      icon: <SparklesIcon sx={{ fontSize: 16 }} />,
      color: theme.palette.primary.main,
      bg: isDark ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.primary.main, 0.1),
      subtitle: 'Fast, lightweight daily assistant',
    };
  };

  const activeDetails = getModelDetails(currentModel.id, currentModel.badge);

  return (
    <>
      <Button
        onClick={handleClick}
        size={size}
        variant="text"
        disableRipple
        aria-label="select AI model"
        aria-expanded={open}
        endIcon={
          <ArrowDownIcon
            sx={{
              fontSize: 18,
              color: 'text.secondary',
              transition: 'transform 0.2s ease',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              ml: -0.25,
            }}
          />
        }
        sx={{
          color: 'text.primary',
          px: { xs: 1, sm: 1.25 },
          py: 0.5,
          height: { xs: 34, sm: 36 },
          borderRadius: '10px',
          bgcolor: open
            ? (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)')
            : (isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'),
          border: '1px solid',
          borderColor: open
            ? alpha(theme.palette.primary.main, 0.4)
            : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'),
          transition: 'all 0.15s ease',
          '&:hover': {
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 22,
              height: 22,
              borderRadius: '6px',
              bgcolor: activeDetails.bg,
              color: activeDetails.color,
              flexShrink: 0,
            }}
          >
            {activeDetails.icon}
          </Box>
          <Typography
            variant="body2"
            noWrap
            sx={{
              fontWeight: 600,
              fontSize: { xs: '0.82rem', sm: '0.85rem' },
              maxWidth: { xs: 180, sm: 220, md: 'none' },
              letterSpacing: '-0.01em',
            }}
          >
            {currentModel.name}
          </Typography>
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              width: { xs: 'calc(100vw - 28px)', sm: 320 },
              maxWidth: { xs: 'calc(100vw - 28px)', sm: 320 },
              mt: 1,
              p: 0.75,
              borderRadius: '14px',
              bgcolor: isDark ? '#0F192C' : '#FFFFFF',
              border: '1px solid',
              borderColor: isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0, 0, 0, 0.08)',
              boxShadow: isDark
                ? '0 16px 40px -8px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0, 163, 255, 0.1)'
                : '0 16px 40px -8px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)',
            },
          },
        }}
      >
        <Box sx={{ px: 1, py: 0.75, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontSize: '0.68rem',
            }}
          >
            Model Selection
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.68rem' }}>
            {AVAILABLE_MODELS.length} Installed
          </Typography>
        </Box>

        <Divider sx={{ my: 0.5, borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)' }} />

        {AVAILABLE_MODELS.map((model) => {
          const isSelected = model.id === currentModel.id;
          const details = getModelDetails(model.id, model.badge);

          return (
            <MenuItem
              key={model.id}
              onClick={() => handleSelect(model as ModelOption)}
              selected={isSelected}
              sx={{
                borderRadius: '10px',
                my: 0.35,
                px: 1,
                py: 0.85,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.25,
                bgcolor: isSelected
                  ? (isDark ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.primary.main, 0.08))
                  : 'transparent',
                border: '1px solid',
                borderColor: isSelected
                  ? alpha(theme.palette.primary.main, 0.25)
                  : 'transparent',
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: isSelected
                    ? (isDark ? alpha(theme.palette.primary.main, 0.18) : alpha(theme.palette.primary.main, 0.12))
                    : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'),
                },
              }}
            >
              {/* Left: Icon + Title & Short Subtitle */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0, flex: 1 }}>
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: '8px',
                    bgcolor: details.bg,
                    color: details.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {details.icon}
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    noWrap
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.84rem',
                      color: 'text.primary',
                      lineHeight: 1.2,
                    }}
                  >
                    {model.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    noWrap
                    color="text.secondary"
                    sx={{
                      display: 'block',
                      fontSize: '0.72rem',
                      lineHeight: 1.3,
                      mt: 0.25,
                    }}
                  >
                    {details.subtitle}
                  </Typography>
                </Box>
              </Box>

              {/* Right: Checkmark if selected */}
              <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, ml: 0.5 }}>
                {isSelected ? (
                  <CheckIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                ) : (
                  <Chip
                    label={model.badge}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.62rem',
                      fontWeight: 600,
                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
                      color: 'text.secondary',
                      border: 'none',
                    }}
                  />
                )}
              </Box>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

