import React from 'react';
import { Typography, Stack, Box } from '@mui/material';
import { AppDialog } from '@/components/common/ui/AppDialog';
import { AppButton } from '@/components/common/ui/AppButton';

interface DeleteChatDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  chatTitle?: string;
  isDeleting?: boolean;
}

export const DeleteChatDialog: React.FC<DeleteChatDialogProps> = ({
  open,
  onClose,
  onConfirm,
  chatTitle,
  isDeleting = false,
}) => {
  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title="Delete Conversation"
      maxWidth="xs"
      actions={
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5, width: '100%', justifyContent: 'flex-end' }}>
          <AppButton variant="outlined" color="inherit" onClick={onClose} disabled={isDeleting}>
            Cancel
          </AppButton>
          <AppButton
            variant="contained"
            color="error"
            onClick={onConfirm}
            loading={isDeleting}
          >
            Delete
          </AppButton>
        </Box>
      }
    >
      <Stack spacing={1.5}>
        <Typography variant="body2" color="text.secondary">
          Are you sure you want to delete{' '}
          <strong style={{ color: 'inherit' }}>&quot;{chatTitle || 'this chat'}&quot;</strong>?
        </Typography>
        <Typography variant="caption" color="error.main">
          This will permanently remove all messages and context from this conversation. This action cannot be undone.
        </Typography>
      </Stack>
    </AppDialog>
  );
};
