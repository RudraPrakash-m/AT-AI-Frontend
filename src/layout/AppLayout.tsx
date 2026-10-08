import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { appConfig } from '@/config/appConfig';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const sidebarWidth = collapsed
    ? appConfig.sidebarCollapsedWidth
    : appConfig.sidebarWidth;

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100vw',
        height: '100dvh',
        maxHeight: '100dvh',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* Desktop Sidebar */}
      <Box
        component="aside"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: sidebarWidth,
          height: '100%',
          flexShrink: 0,
          transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
        />
      </Box>

      {/* Mobile Drawer */}
      <MobileNavigation
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      {/* Main App Workspace */}
      <Box
        component="main"
        sx={{
          flex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Outlet context={{ onOpenMobileMenu: () => setMobileDrawerOpen(true) }} />
      </Box>
    </Box>
  );
};
