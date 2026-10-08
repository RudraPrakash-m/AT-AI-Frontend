import React, { useState } from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  useTheme,
  Box,
} from '@mui/material';
import {
  ChatBubbleOutlined as ChatIcon,
  MoreHoriz as MoreIcon,
  DriveFileRenameOutline as RenameIcon,
  DeleteOutlined as DeleteIcon,
  PushPinOutlined as PinIcon,
  PushPin as PinnedIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { AppTooltip } from '@/components/common/ui/AppTooltip';
import type { ChatHistoryItemType } from '../types/historyChat.types';

interface ChatHistoryItemProps {
  item: ChatHistoryItemType;
  isActive: boolean;
  collapsed?: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, newTitle: string) => Promise<void>;
  onTogglePin: (id: string) => void;
  onDeletePrompt: (item: ChatHistoryItemType) => void;
}

export const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({
  item,
  isActive,
  collapsed = false,
  onSelect,
  onRename,
  onTogglePin,
  onDeletePrompt,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStartRename = () => {
    handleMenuClose();
    setEditTitle(item.title);
    setIsEditing(true);
  };

  const handleSaveRename = async (e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    if (editTitle.trim() && editTitle.trim() !== item.title) {
      await onRename(item.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelRename = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    setEditTitle(item.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveRename(e);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(item.title);
    }
  };

  if (collapsed) {
    return (
      <AppTooltip title={item.title} placement="right">
        <ListItem disablePadding sx={{ my: 0.5 }}>
          <ListItemButton
            selected={isActive}
            onClick={() => onSelect(item.id)}
            sx={{
              justifyContent: 'center',
              px: 1,
              py: 1,
              borderRadius: '8px',
              minWidth: 0,
            }}
          >
            <ChatIcon fontSize="small" color={isActive ? 'primary' : 'inherit'} />
          </ListItemButton>
        </ListItem>
      </AppTooltip>
    );
  }

  return (
    <ListItem
      disablePadding
      sx={{
        my: 0.25,
        '&:hover .chat-item-actions': {
          opacity: 1,
          pointerEvents: 'auto',
        },
      }}
    >
      <ListItemButton
        selected={isActive}
        onClick={() => !isEditing && onSelect(item.id)}
        sx={{
          py: 0.75,
          px: 1.25,
          borderRadius: '8px',
          bgcolor: isActive
            ? theme.palette.mode === 'dark'
              ? 'rgba(0, 163, 255, 0.14)'
              : 'rgba(2, 132, 199, 0.1)'
            : 'transparent',
          borderLeft: isActive
            ? `3px solid ${theme.palette.mode === 'dark' ? '#00A3FF' : '#0284C7'}`
            : '3px solid transparent',
          '&:hover': {
            bgcolor: isActive
              ? theme.palette.mode === 'dark'
                ? 'rgba(0, 163, 255, 0.18)'
                : 'rgba(2, 132, 199, 0.14)'
              : theme.palette.mode === 'dark'
                ? 'rgba(0, 163, 255, 0.06)'
                : 'rgba(2, 132, 199, 0.05)',
          },
          '&.Mui-selected': {
            bgcolor: theme.palette.mode === 'dark'
              ? 'rgba(0, 163, 255, 0.14)'
              : 'rgba(2, 132, 199, 0.1)',
          },
        }}
      >
        {item.isPinned && (
          <ListItemIcon sx={{ minWidth: 22, color: 'text.secondary', opacity: 0.8 }}>
            <PinnedIcon sx={{ fontSize: 14, transform: 'rotate(45deg)' }} />
          </ListItemIcon>
        )}

        {isEditing ? (
          <Box
            sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.5, flex: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <TextField
              size="small"
              variant="standard"
              value={editTitle}
              autoFocus
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              slotProps={{ input: { style: { fontSize: '0.85rem', padding: '2px 4px' } } }}
              sx={{ flex: 1 }}
            />
            <IconButton size="small" onClick={handleSaveRename} sx={{ p: 0.25 }}>
              <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />
            </IconButton>
            <IconButton size="small" onClick={handleCancelRename} sx={{ p: 0.25 }}>
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        ) : (
          <>
            <ListItemText
              primary={item.title}
              slotProps={{
                primary: {
                  noWrap: true,
                  sx: {
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'text.primary' : 'text.secondary',
                    fontSize: '0.84rem',
                  },
                },
              }}
            />

            <Box
              className="chat-item-actions"
              sx={{
                display: 'flex',
                alignItems: 'center',
                opacity: isMenuOpen ? 1 : 0,
                transition: 'opacity 0.15s ease',
              }}
            >
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                aria-label="chat options"
                sx={{
                  p: 0.5,
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' },
                }}
              >
                <MoreIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </>
        )}
      </ListItemButton>

      {/* Item Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 160,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              borderRadius: '12px',
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onTogglePin(item.id);
          }}
          sx={{ fontSize: '0.85rem', py: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 28 }}>
            {item.isPinned ? (
              <PinIcon sx={{ fontSize: 18 }} />
            ) : (
              <PinnedIcon sx={{ fontSize: 18 }} />
            )}
          </ListItemIcon>
          {item.isPinned ? 'Unpin Chat' : 'Pin to Top'}
        </MenuItem>

        <MenuItem onClick={handleStartRename} sx={{ fontSize: '0.85rem', py: 1 }}>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <RenameIcon sx={{ fontSize: 18 }} />
          </ListItemIcon>
          Rename
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleMenuClose();
            onDeletePrompt(item);
          }}
          sx={{ fontSize: '0.85rem', py: 1, color: 'error.main' }}
        >
          <ListItemIcon sx={{ minWidth: 28, color: 'error.main' }}>
            <DeleteIcon sx={{ fontSize: 18 }} />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </ListItem>
  );
};
