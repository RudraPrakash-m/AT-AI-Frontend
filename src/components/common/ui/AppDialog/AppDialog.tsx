import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Stack,
  type DialogProps,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

export interface AppDialogProps extends Omit<DialogProps, 'title'> {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const AppDialog: React.FC<AppDialogProps> = ({
  open,
  onClose,
  title,
  subtitle,
  actions,
  children,
  maxWidth = 'sm',
  ...props
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      slotProps={{
        paper: {
          sx: {
            p: 1,
          },
        },
      }}
      {...props}
    >
      <DialogTitle sx={{ pb: 1, pt: 2, px: 2.5 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack spacing={0.25}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Stack>
          <IconButton
            size="small"
            onClick={onClose}
            aria-label="Close dialog"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 2.5, py: 1.5 }}>
        {children}
      </DialogContent>

      {actions && (
        <DialogActions sx={{ px: 2.5, pb: 2, pt: 1.5 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};
