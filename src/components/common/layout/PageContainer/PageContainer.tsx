import React from 'react';
import { Box, type BoxProps } from '@mui/material';

export interface PageContainerProps extends BoxProps {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, sx, ...props }) => {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
