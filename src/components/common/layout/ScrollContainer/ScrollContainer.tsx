import React, { forwardRef } from 'react';
import { Box, type BoxProps } from '@mui/material';

export interface ScrollContainerProps extends BoxProps {
  children: React.ReactNode;
}

export const ScrollContainer = forwardRef<HTMLDivElement, ScrollContainerProps>(
  ({ children, sx, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
            width: 0,
            height: 0,
          },
          ...sx,
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

ScrollContainer.displayName = 'ScrollContainer';
