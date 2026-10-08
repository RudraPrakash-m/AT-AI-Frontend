import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  DriveFileRenameOutline as NewChatIcon,
  SearchOutlined as SearchIcon,
  PushPinOutlined as PinIcon,
  ChatBubbleOutlineRounded as ChatIcon,
  ViewSidebarOutlined as ToggleSidebarIcon,
  SettingsOutlined as SettingsIcon,
  PersonOutlined as ProfileIcon,
  DarkModeOutlined as DarkModeIcon,
  LightModeOutlined as LightModeIcon,
  LogoutOutlined as LogoutIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { AppTooltip } from '@/components/common/ui/AppTooltip';
import { AppInput } from '@/components/common/ui/AppInput';
import { ScrollContainer } from '@/components/common/layout/ScrollContainer';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useThemeMode } from '@/theme/ThemeContext';
import { useChatHistory } from '@/features/historyChat/hooks/useChatHistory';
import { useChatHistorySearch } from '@/features/historyChat/hooks/useChatHistorySearch';
import { ChatHistoryList } from '@/features/historyChat/components/ChatHistoryList';

// Swirl / Knot AI Logo matching ChatGPT aesthetic
const ATSwirlLogo: React.FC<{ sx?: object }> = ({ sx }) => (
  <Box
    component="svg"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    sx={{ width: 24, height: 24, ...sx }}
  >
    <path
      d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.5 8.5C15.8 7.5 14.6 7 13.2 7c-2.3 0-4.2 1.9-4.2 4.2 0 1.2.5 2.3 1.3 3.1"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 15.5c.7 1 1.9 1.5 3.3 1.5 2.3 0 4.2-1.9 4.2-4.2 0-1.2-.5-2.3-1.3-3.1"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.75" />
  </Box>
);

// Triple Bookshelf / Library Icon matching the screenshot
const BookshelfSpinesIcon: React.FC<{ sx?: object }> = ({ sx }) => (
  <Box
    component="svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    sx={{ width: 20, height: 20, ...sx }}
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H7a2.5 2.5 0 0 1 2.5 2.5v15A2.5 2.5 0 0 1 7 22h-.5A2.5 2.5 0 0 1 4 19.5Z" />
    <path d="M9.5 19.5v-15A2.5 2.5 0 0 1 12 2h.5a2.5 2.5 0 0 1 2.5 2.5v15a2.5 2.5 0 0 1-2.5 2.5H12a2.5 2.5 0 0 1-2.5-2.5Z" />
    <path d="M15.5 4.5l3.5 15a2.5 2.5 0 0 0 3-1.8l.2-.9a2.5 2.5 0 0 0-1.8-3l-3.5-15a2.5 2.5 0 0 0-3 1.8l-.2.9a2.5 2.5 0 0 0 1.8 3Z" />
  </Box>
);

// Keyboard Shortcut Pill Component
const ShortcutKey: React.FC<{ label: string }> = ({ label }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.65rem',
      fontWeight: 600,
      fontFamily: 'JetBrains Mono, monospace',
      px: 0.75,
      py: 0.2,
      borderRadius: '5px',
      bgcolor: 'rgba(255, 255, 255, 0.06)',
      border: '1px solid',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      color: 'text.secondary',
      letterSpacing: '0.02em',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      lineHeight: 1.2,
    }}
  >
    {label}
  </Box>
);

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobileDrawer?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  onCloseMobileDrawer,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const isDark = theme.palette.mode === 'dark';

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isProfileMenuOpen = Boolean(anchorEl);

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pinned'>('all');

  const { searchTerm, setSearchTerm, debouncedQuery } = useChatHistorySearch();

  const filterOptions = useMemo(
    () => ({
      searchQuery: debouncedQuery,
      isPinnedOnly: activeFilter === 'pinned',
    }),
    [debouncedQuery, activeFilter]
  );

  const {
    conversations,
    groupedConversations,
    isLoading,
    activeConversationId,
    selectConversation,
    startNewChat,
    renameConversation,
    togglePin,
    deleteConversation,
  } = useChatHistory(filterOptions);


  const pinnedCount = conversations.filter((c) => c.isPinned).length;

  const handleSelectChat = (id: string) => {
    selectConversation(id);
    if (onCloseMobileDrawer) onCloseMobileDrawer();
    setSearchModalOpen(false);
  };

  const handleStartNewChat = useCallback(() => {
    startNewChat();
    if (onCloseMobileDrawer) onCloseMobileDrawer();
  }, [startNewChat, onCloseMobileDrawer]);


  const handleNav = (path: string) => {
    navigate(path);
    if (onCloseMobileDrawer) onCloseMobileDrawer();
  };

  const handleSearchClick = () => {
    setSearchModalOpen(true);
  };

  // Global Keyboard Shortcuts (Ctrl+K = Search, Ctrl+N = New Chat, Ctrl+/ = Toggle Sidebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      } else if (modifier && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleStartNewChat();
      } else if (modifier && e.key === '/') {
        e.preventDefault();
        onToggleCollapse();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleCollapse, handleStartNewChat]);


  // --------------------------------------------------------------------------
  // 1. COLLAPSED DOCK (Matches the vertical iconic bar from user's image)
  // --------------------------------------------------------------------------
  if (collapsed) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 1.75,
          bgcolor: isDark ? '#000000' : '#F9F9FB',
          borderRight: '1px solid',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          userSelect: 'none',
          boxSizing: 'border-box',
        }}
      >
        {/* 1. Top Logo (Brand swirl / AI icon - expands on click) */}
        <AppTooltip title="Expand Sidebar" placement="right">
          <IconButton
            onClick={onToggleCollapse}
            sx={{
              color: isDark ? '#FFFFFF' : '#111827',
              p: 1,
              mb: 2,
              borderRadius: '12px',
              '&:hover': {
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
              },
            }}
          >
            <ATSwirlLogo sx={{ fontSize: 24 }} />
          </IconButton>
        </AppTooltip>

        {/* 2. New Chat Icon (Square Pen) */}
        <AppTooltip title="New chat" placement="right">
          <IconButton
            onClick={handleStartNewChat}
            sx={{
              color: isDark ? '#D1D5DB' : '#374151',
              p: 1,
              mb: 1.25,
              borderRadius: '10px',
              '&:hover': {
                color: isDark ? '#FFFFFF' : '#111827',
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              },
            }}
          >
            <NewChatIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </AppTooltip>

        {/* 3. Search Icon */}
        <AppTooltip title="Search chats" placement="right">
          <IconButton
            onClick={handleSearchClick}
            sx={{
              color: isDark ? '#D1D5DB' : '#374151',
              p: 1,
              mb: 1.25,
              borderRadius: '10px',
              '&:hover': {
                color: isDark ? '#FFFFFF' : '#111827',
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              },
            }}
          >
            <SearchIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </AppTooltip>

        {/* 4. Pinned Chats Icon */}
        <AppTooltip title={activeFilter === 'pinned' ? 'All chats' : 'Pinned chats'} placement="right">
          <IconButton
            onClick={() => setActiveFilter((prev) => (prev === 'pinned' ? 'all' : 'pinned'))}
            sx={{
              color: activeFilter === 'pinned' ? 'primary.main' : isDark ? '#D1D5DB' : '#374151',
              bgcolor: activeFilter === 'pinned' ? (isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.1)') : 'transparent',
              p: 1,
              mb: 1.25,
              borderRadius: '10px',
              '&:hover': {
                color: isDark ? '#FFFFFF' : '#111827',
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              },
            }}
          >
            <PinIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </AppTooltip>

        {/* 5. Chats / Recents Icon */}
        <AppTooltip title="Recent conversations" placement="right">
          <IconButton
            onClick={() => handleNav('/chat')}
            sx={{
              color: isDark ? '#D1D5DB' : '#374151',
              p: 1,
              mb: 1.25,
              borderRadius: '10px',
              '&:hover': {
                color: isDark ? '#FFFFFF' : '#111827',
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              },
            }}
          >
            <ChatIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </AppTooltip>

        {/* 6. Library Bookshelf Icon */}
        <AppTooltip title="Library & Archives" placement="right">
          <IconButton
            onClick={() => handleNav('/history')}
            sx={{
              color: isDark ? '#D1D5DB' : '#374151',
              p: 1,
              mb: 1.25,
              borderRadius: '10px',
              '&:hover': {
                color: isDark ? '#FFFFFF' : '#111827',
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              },
            }}
          >
            <BookshelfSpinesIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </AppTooltip>

        {/* Vertical Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* 7. Bottom User Avatar Capsule (Initial RM) */}
        <AppTooltip title={user?.name || 'Rudra Prakash'} placement="right">
          <Box
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: isDark ? '#566171' : '#64748B',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, opacity 0.15s ease',
              '&:hover': {
                transform: 'scale(1.06)',
                opacity: 0.9,
              },
            }}
          >
            RM
          </Box>
        </AppTooltip>

        {/* User Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={isProfileMenuOpen}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
          slotProps={{
            paper: {
              sx: {
                width: 220,
                p: 0.5,
                borderRadius: '12px',
                boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
              },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              handleNav('/profile');
            }}
            sx={{ fontSize: '0.85rem', py: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 28 }}>
              <ProfileIcon fontSize="small" />
            </ListItemIcon>
            Profile & Quota
          </MenuItem>

          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              handleNav('/settings');
            }}
            sx={{ fontSize: '0.85rem', py: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 28 }}>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>

          <MenuItem
            onClick={() => {
              toggleTheme();
            }}
            sx={{ fontSize: '0.85rem', py: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 28 }}>
              {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </ListItemIcon>
            {mode === 'dark' ? 'Light Theme' : 'Dark Theme'}
          </MenuItem>

          <Divider sx={{ my: 0.5 }} />

          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              logout();
            }}
            sx={{ fontSize: '0.85rem', py: 1, color: 'error.main' }}
          >
            <ListItemIcon sx={{ minWidth: 28, color: 'error.main' }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Sign Out
          </MenuItem>
        </Menu>

        {/* Quick Search Dialog */}
        <Dialog
          open={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          fullWidth
          maxWidth="sm"
          slotProps={{
            paper: {
              sx: {
                p: 1.5,
                borderRadius: '16px',
                bgcolor: 'background.paper',
              },
            },
          }}
        >
          <DialogTitle sx={{ px: 2, py: 1, fontSize: '1rem', fontWeight: 700 }}>
            Search Conversations
          </DialogTitle>
          <DialogContent sx={{ px: 2, pt: 1, pb: 2 }}>
            <AppInput
              placeholder="Search past chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              fullWidth
              slotProps={{
                input: {
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
                },
              }}
            />
            <List sx={{ mt: 1.5, maxHeight: 300, overflowY: 'auto' }}>
              {conversations.slice(0, 8).map((chat) => (
                <ListItemButton
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  sx={{ borderRadius: '8px', py: 1 }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ChatIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={chat.title}
                    secondary={chat.preview}
                    slotProps={{
                      primary: { sx: { fontSize: '0.85rem', fontWeight: 600 }, noWrap: true },
                      secondary: { sx: { fontSize: '0.75rem' }, noWrap: true },
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </DialogContent>
        </Dialog>
      </Box>
    );
  }

  // --------------------------------------------------------------------------
  // 2. EXPANDED SIDEBAR (ChatGPT-inspired full navigation experience)
  // --------------------------------------------------------------------------
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: isDark ? '#000000' : '#F7F7F8',
        borderRight: '1px solid',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        userSelect: 'none',
      }}
    >
      {/* Top Header: Brand Title + Quick Action Icons */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1.75,
          py: 1.25,
          minHeight: 48,
        }}
      >
        <Box
          onClick={() => handleNav('/chat')}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            px: 0.75,
            py: 0.5,
            borderRadius: '8px',
            '&:hover': { bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)' },
          }}
        >
          <ATSwirlLogo sx={{ fontSize: 20, color: 'text.primary' }} />
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              letterSpacing: '-0.02em',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '0.92rem',
              color: 'text.primary',
            }}
          >
            AT AI
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.25 }}>
          <AppTooltip title="Search chats (Ctrl+K)">
            <IconButton size="small" onClick={() => setSearchModalOpen(true)} sx={{ color: 'text.secondary', p: 0.75 }}>
              <SearchIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </AppTooltip>

          <AppTooltip title="New chat (Ctrl+N)">
            <IconButton size="small" onClick={handleStartNewChat} sx={{ color: 'text.secondary', p: 0.75 }}>
              <NewChatIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </AppTooltip>

          <AppTooltip title="Close sidebar (Ctrl+/)">
            <IconButton size="small" onClick={onToggleCollapse} sx={{ color: 'text.secondary', p: 0.75 }}>
              <ToggleSidebarIcon sx={{ fontSize: 19 }} />
            </IconButton>
          </AppTooltip>
        </Box>
      </Box>

      {/* Main Action: Sleek New chat button */}
      <Box sx={{ px: 1.5, pb: 1, pt: 0.25 }}>
        <Button
          fullWidth
          variant="text"
          onClick={handleStartNewChat}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 1.5,
            py: 0.85,
            borderRadius: '10px',
            color: 'text.primary',
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
            fontWeight: 600,
            fontSize: '0.85rem',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
            transition: 'all 0.15s ease',
            '&:hover': {
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.07)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <NewChatIcon sx={{ fontSize: 18, color: 'text.primary' }} />
            <span>New chat</span>
          </Box>
          <ShortcutKey label="Ctrl N" />
        </Button>
      </Box>

      {/* Filter / Quick Tabs */}
      <Box sx={{ px: 1.5, pb: 1, display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Box
          onClick={() => setActiveFilter('all')}
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 0.45,
            borderRadius: '7px',
            fontSize: '0.74rem',
            fontWeight: activeFilter === 'all' ? 600 : 500,
            cursor: 'pointer',
            bgcolor: activeFilter === 'all'
              ? isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
              : 'transparent',
            color: activeFilter === 'all' ? 'text.primary' : 'text.secondary',
            border: '1px solid',
            borderColor: activeFilter === 'all'
              ? isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
              : 'transparent',
            transition: 'all 0.15s ease',
            '&:hover': {
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
              color: 'text.primary',
            },
          }}
        >
          All
        </Box>

        <Box
          onClick={() => setActiveFilter((prev) => (prev === 'pinned' ? 'all' : 'pinned'))}
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            py: 0.45,
            borderRadius: '7px',
            fontSize: '0.74rem',
            fontWeight: activeFilter === 'pinned' ? 600 : 500,
            cursor: 'pointer',
            bgcolor: activeFilter === 'pinned'
              ? isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
              : 'transparent',
            color: activeFilter === 'pinned' ? 'text.primary' : 'text.secondary',
            border: '1px solid',
            borderColor: activeFilter === 'pinned'
              ? isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
              : 'transparent',
            transition: 'all 0.15s ease',
            '&:hover': {
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
              color: 'text.primary',
            },
          }}
        >
          <PinIcon sx={{ fontSize: 13 }} />
          <span>Pinned{pinnedCount > 0 ? ` (${pinnedCount})` : ''}</span>
        </Box>

        <AppTooltip title="Library & Archive">
          <Box
            onClick={() => handleNav('/history')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              px: 1,
              py: 0.45,
              borderRadius: '7px',
              fontSize: '0.74rem',
              fontWeight: 500,
              cursor: 'pointer',
              color: 'text.secondary',
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                color: 'text.primary',
              },
            }}
          >
            <BookshelfSpinesIcon sx={{ fontSize: 14 }} />
          </Box>
        </AppTooltip>
      </Box>

      <Divider sx={{ mb: 0.5, borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)' }} />

      {/* Scrollable Clean Temporal Chat History Stream */}
      <ScrollContainer sx={{ px: 1, py: 0.5 }}>
        <ChatHistoryList
          groups={groupedConversations}
          isLoading={isLoading}
          activeId={activeConversationId}
          collapsed={false}
          onSelect={handleSelectChat}
          onRename={renameConversation}
          onTogglePin={togglePin}
          onDelete={deleteConversation}
        />
      </ScrollContainer>

      {/* Bottom User Profile Section */}
      <Box
        sx={{
          p: 1.5,
          borderTop: '1px solid',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        }}
      >
        <Box
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1,
            borderRadius: '12px',
            cursor: 'pointer',
            bgcolor: isProfileMenuOpen ? 'action.selected' : 'transparent',
            '&:hover': { bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)' },
            transition: 'background-color 0.15s ease',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: isDark ? '#566171' : '#64748B',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            >
              RM
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" noWrap color="text.primary" sx={{ fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.01em' }}>
                {user?.name || 'RUDRA PRAKASH MALLICK'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.7rem', display: 'block' }}>
                Go Tier
              </Typography>
            </Box>
          </Box>

          <IconButton size="small" sx={{ color: 'text.secondary', p: 0.5 }}>
            <MoreVertIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      {/* User Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={isProfileMenuOpen}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        slotProps={{
          paper: {
            sx: {
              width: 220,
              p: 0.5,
              borderRadius: '12px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleNav('/profile');
          }}
          sx={{ fontSize: '0.85rem', py: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 28 }}>
            <ProfileIcon fontSize="small" />
          </ListItemIcon>
          Profile & Quota
        </MenuItem>

        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleNav('/settings');
          }}
          sx={{ fontSize: '0.85rem', py: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 28 }}>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>

        <MenuItem
          onClick={() => {
            toggleTheme();
          }}
          sx={{ fontSize: '0.85rem', py: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 28 }}>
            {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </ListItemIcon>
          {mode === 'dark' ? 'Light Theme' : 'Dark Theme'}
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            logout();
          }}
          sx={{ fontSize: '0.85rem', py: 1, color: 'error.main' }}
        >
          <ListItemIcon sx={{ minWidth: 28, color: 'error.main' }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>

      {/* Quick Search Dialog */}
      <Dialog
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              p: 1.5,
              borderRadius: '16px',
              bgcolor: 'background.paper',
            },
          },
        }}
      >
        <DialogTitle sx={{ px: 2, py: 1, fontSize: '1rem', fontWeight: 700 }}>
          Search Conversations
        </DialogTitle>
        <DialogContent sx={{ px: 2, pt: 1, pb: 2 }}>
          <AppInput
            placeholder="Search past chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            fullWidth
            slotProps={{
              input: {
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
              },
            }}
          />
          <List sx={{ mt: 1.5, maxHeight: 300, overflowY: 'auto' }}>
            {conversations.slice(0, 8).map((chat) => (
              <ListItemButton
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                sx={{ borderRadius: '8px', py: 1 }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ChatIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={chat.title}
                  secondary={chat.preview}
                  slotProps={{
                    primary: { sx: { fontSize: '0.85rem', fontWeight: 600 }, noWrap: true },
                    secondary: { sx: { fontSize: '0.75rem' }, noWrap: true },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
