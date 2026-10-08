import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  List,
  ListItem,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Key as KeyIcon,
  ContentCopy as CopyIcon,
  DeleteOutlined as DeleteIcon,
  Add as AddIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { AppButton } from '@/components/common/ui/AppButton';
import { AppTooltip } from '@/components/common/ui/AppTooltip';
import { copyToClipboard } from '@/utils/string.utils';
import { formatDate } from '@/utils/date.utils';
import type { ApiKeyItem } from '../types/profile.types';

interface ApiKeyManagerProps {
  apiKeys: ApiKeyItem[];
  onCreateKey: (name: string) => Promise<ApiKeyItem>;
  onDeleteKey: (id: string) => Promise<void>;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({
  apiKeys,
  onCreateKey,
  onDeleteKey,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopy = async (id: string, text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleCreate = async () => {
    if (!keyName.trim()) return;
    try {
      setIsSubmitting(true);
      await onCreateKey(keyName.trim());
      setKeyName('');
      setOpenModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              API Access Keys
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generate secret tokens for programmatic API integration and custom CLI tools.
            </Typography>
          </Box>
          <AppButton
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
          >
            Create Secret Key
          </AppButton>
        </Box>

        <List disablePadding>
          {apiKeys.map((key) => (
            <ListItem
              key={key.id}
              sx={{
                my: 1,
                p: 2,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'action.hover',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '8px',
                    bgcolor: 'action.selected',
                    color: 'primary.main',
                  }}
                >
                  <KeyIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {key.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {key.keyPreview}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.disabled">
                  Created {formatDate(key.createdAt)}
                </Typography>
                <AppTooltip title={copiedId === key.id ? 'Copied' : 'Copy Key'}>
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(key.id, key.keyPreview)}
                    sx={{ color: copiedId === key.id ? 'success.main' : 'text.secondary' }}
                  >
                    {copiedId === key.id ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
                  </IconButton>
                </AppTooltip>
                <AppTooltip title="Revoke Key">
                  <IconButton
                    size="small"
                    onClick={() => onDeleteKey(key.id)}
                    sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </AppTooltip>
              </Box>
            </ListItem>
          ))}
        </List>

        {/* Create Key Dialog */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs">
          <DialogTitle>Create New Secret Key</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Give your API key a descriptive name to easily identify its purpose.
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="Key Name"
              placeholder="e.g. CI/CD Deployment Worker"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              autoFocus
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <AppButton variant="outlined" color="inherit" onClick={() => setOpenModal(false)}>
              Cancel
            </AppButton>
            <AppButton
              variant="contained"
              onClick={handleCreate}
              loading={isSubmitting}
              disabled={!keyName.trim()}
            >
              Create
            </AppButton>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};
