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
        borderRadius: { xs: '14px', sm: '16px' },
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: { xs: 1.5, sm: 2 },
            mb: 2.5,
          }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1.05rem', sm: '1.2rem' } }}>
              API Access Keys
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              Generate secret tokens for programmatic API integration and custom CLI tools.
            </Typography>
          </Box>
          <AppButton
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
            sx={{
              whiteSpace: 'nowrap',
              flexShrink: 0,
              alignSelf: { xs: 'stretch', sm: 'auto' },
              fontWeight: 600,
              py: { xs: 0.85, sm: 0.75 },
              px: { xs: 2, sm: 2.25 },
            }}
          >
            Create Secret Key
          </AppButton>
        </Box>

        {apiKeys.length === 0 ? (
          <Box
            sx={{
              py: 4,
              px: 2,
              textAlign: 'center',
              borderRadius: '12px',
              border: '1px dashed',
              borderColor: 'divider',
              bgcolor: 'action.hover',
            }}
          >
            <KeyIcon sx={{ fontSize: 32, color: 'text.disabled', mb: 1 }} />
            <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 600 }}>
              No API Keys Created Yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click &quot;Create Secret Key&quot; above to generate your first developer access token.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {apiKeys.map((key) => (
              <ListItem
                key={key.id}
                sx={{
                  my: 1,
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'action.hover',
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'stretch', md: 'center' },
                  justifyContent: 'space-between',
                  gap: { xs: 1.25, sm: 1.5 },
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                {/* Left Side: Icon + Name + Masked Token */}
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: '8px',
                      bgcolor: 'action.selected',
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <KeyIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      noWrap
                      sx={{ fontWeight: 700, fontSize: { xs: '0.88rem', sm: '0.92rem' } }}
                    >
                      {key.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                      sx={{
                        fontFamily: 'JetBrains Mono, monospace',
                        display: 'block',
                        fontSize: { xs: '0.74rem', sm: '0.8rem' },
                        mt: 0.25,
                      }}
                    >
                      {key.keyPreview}
                    </Typography>
                  </Box>
                </Box>

                {/* Right Side: Created Date + Actions */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: { xs: 'space-between', md: 'flex-end' },
                    width: { xs: '100%', md: 'auto' },
                    gap: 1.25,
                    pt: { xs: 1, md: 0 },
                    borderTop: { xs: '1px solid', md: 'none' },
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="caption" color="text.disabled" sx={{ fontSize: { xs: '0.72rem', sm: '0.78rem' } }}>
                    Created {formatDate(key.createdAt)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AppTooltip title={copiedId === key.id ? 'Copied' : 'Copy Key'}>
                      <IconButton
                        size="small"
                        onClick={() => handleCopy(key.id, key.keyPreview)}
                        sx={{
                          color: copiedId === key.id ? 'success.main' : 'text.secondary',
                          p: 0.75,
                          '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
                        }}
                      >
                        {copiedId === key.id ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
                      </IconButton>
                    </AppTooltip>
                    <AppTooltip title="Revoke Key">
                      <IconButton
                        size="small"
                        onClick={() => onDeleteKey(key.id)}
                        sx={{
                          color: 'text.disabled',
                          p: 0.75,
                          '&:hover': { color: 'error.main', bgcolor: 'rgba(239, 68, 68, 0.08)' },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </AppTooltip>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        )}

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
