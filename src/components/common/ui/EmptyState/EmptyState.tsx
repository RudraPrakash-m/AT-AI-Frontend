import React from 'react';
import { Box, Typography, Stack, type BoxProps } from '@mui/material';
import { AppButton } from '../AppButton';

export interface EmptyStateProps extends BoxProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  actionNode?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  actionNode,
  sx,
  ...props
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 6,
        px: 3,
        ...sx,
      }}
      {...props}
    >
      <Stack spacing={2} sx={{ alignItems: 'center', maxWidth: 420 }}>
        {icon && (
          <Box
            sx={{
              display: 'inline-flex',
              p: 2,
              borderRadius: '50%',
              bgcolor: 'action.hover',
              color: 'primary.main',
              mb: 1,
            }}
          >
            {icon}
          </Box>
        )}
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
        {actionNode}
        {actionText && onAction && !actionNode && (
          <AppButton
            variant="contained"
            color="primary"
            onClick={onAction}
            sx={{ mt: 1 }}
          >
            {actionText}
          </AppButton>
        )}
      </Stack>
    </Box>
  );
};
