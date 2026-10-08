import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Typography,
  Chip,
  Box,
  useTheme,
} from '@mui/material';
import {
  KeyboardArrowDown as ArrowDownIcon,
  AutoAwesome as SparklesIcon,
  Check as CheckIcon,
  Bolt as FlashIcon,
  Psychology as ReasoningIcon,
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

  const getModelIcon = (badge: string) => {
    switch (badge) {
      case 'Reasoning':
        return <ReasoningIcon sx={{ fontSize: 16, color: '#A78BFA' }} />;
      case 'Free':
      case 'Fast':
        return <FlashIcon sx={{ fontSize: 16, color: '#FBBF24' }} />;
      default:
        return <SparklesIcon sx={{ fontSize: 16, color: 'primary.main' }} />;
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        size={size}
        variant="text"
        endIcon={<ArrowDownIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
        sx={{
          color: 'text.primary',
          px: 1.5,
          py: 0.5,
          borderRadius: '12px',
          bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
          border: '1px solid',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          '&:hover': {
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
          {getModelIcon(currentModel.badge)}
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
            {currentModel.name}
          </Typography>
          <Chip
            label={currentModel.badge}
            size="small"
            sx={{
              height: 18,
              fontSize: '0.65rem',
              fontWeight: 700,
              bgcolor: currentModel.isPro ? 'primary.main' : 'action.selected',
              color: currentModel.isPro ? '#ffffff' : 'text.primary',
            }}
          />
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
            sx: {
              width: 320,
              p: 0.5,
              borderRadius: '14px',
              boxShadow: isDark
                ? '0 16px 36px rgba(0, 0, 0, 0.6)'
                : '0 16px 36px rgba(0, 0, 0, 0.1)',
            },
          },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            display: 'block',
            fontWeight: 700,
            color: 'text.disabled',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          Model Architecture
        </Typography>

        {AVAILABLE_MODELS.map((model) => {
          const isSelected = model.id === currentModel.id;

          return (
            <MenuItem
              key={model.id}
              onClick={() => handleSelect(model as ModelOption)}
              selected={isSelected}
              sx={{
                borderRadius: '10px',
                my: 0.5,
                p: 1.5,
                alignItems: 'flex-start',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                    {getModelIcon(model.badge)}
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {model.name}
                    </Typography>
                    <Chip
                      label={model.badge}
                      size="small"
                      sx={{ height: 18, fontSize: '0.65rem', fontWeight: 600 }}
                    />
                  </Box>
                  {isSelected && <CheckIcon fontSize="small" color="primary" />}
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
                  {model.description}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, pt: 0.25 }}>
                  <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                    Window: {model.contextWindow}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                    • {model.provider}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
