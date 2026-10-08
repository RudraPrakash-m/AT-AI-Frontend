import React from 'react';
import { Container, type ContainerProps } from '@mui/material';

export interface ResponsiveContainerProps extends ContainerProps {
  children: React.ReactNode;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'md',
  sx,
  ...props
}) => {
  return (
    <Container
      maxWidth={maxWidth}
      disableGutters
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        width: '100%',
        mx: 'auto',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Container>
  );
};
