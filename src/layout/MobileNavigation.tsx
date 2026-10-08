import React from 'react';
import { Drawer } from '@mui/material';
import { appConfig } from '@/config/appConfig';
import { Sidebar } from './Sidebar';

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ open, onClose }) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          width: appConfig.sidebarWidth,
          boxSizing: 'border-box',
          backgroundImage: 'none',
        },
      }}
    >
      <Sidebar
        collapsed={false}
        onToggleCollapse={onClose}
        onCloseMobileDrawer={onClose}
      />
    </Drawer>
  );
};
