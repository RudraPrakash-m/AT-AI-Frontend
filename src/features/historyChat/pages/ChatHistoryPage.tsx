import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Chip,
  IconButton,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  ChatBubbleOutlined as ChatIcon,
  PushPin as PinnedIcon,
  DeleteOutlined as DeleteIcon,
  ArrowForward as ArrowIcon,
  Schedule as TimeIcon,
} from '@mui/icons-material';
import { PageContainer } from '@/components/common/layout/PageContainer';
import { ScrollContainer } from '@/components/common/layout/ScrollContainer';
import { ResponsiveContainer } from '@/components/common/layout/ResponsiveContainer';
import { AppInput } from '@/components/common/ui/AppInput';
import { AppButton } from '@/components/common/ui/AppButton';
import { EmptyState } from '@/components/common/ui/EmptyState';
import { formatDate } from '@/utils/date.utils';
import { AVAILABLE_MODELS } from '@/constants';
import { useChatHistory } from '../hooks/useChatHistory';
import { DeleteChatDialog } from '../components/DeleteChatDialog';
import type { ChatHistoryItemType } from '../types/historyChat.types';

export const ChatHistoryPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [modelFilter, setModelFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<ChatHistoryItemType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const historyFilter = React.useMemo(
    () => ({
      searchQuery: search,
      modelId: modelFilter === 'all' ? undefined : modelFilter,
    }),
    [search, modelFilter]
  );

  const {
    conversations,
    isLoading,
    selectConversation,
    startNewChat,
    togglePin,
    deleteConversation,
  } = useChatHistory(historyFilter);


  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteConversation(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PageContainer>
      <ScrollContainer>
        <ResponsiveContainer maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              mb: 4,
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Chat History & Archives
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Browse, search, and manage all your past intelligence sessions and code reviews.
              </Typography>
            </Box>
            <AppButton variant="contained" onClick={startNewChat}>
              + New Conversation
            </AppButton>
          </Stack>

          {/* Filters Bar */}
          <Card
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: '12px',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
              <Grid size={{ xs: 12, sm: 8 }}>
                <AppInput
                  placeholder="Search by keywords, tags, or prompts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="model-filter-label">Filter by Model</InputLabel>
                  <Select
                    labelId="model-filter-label"
                    value={modelFilter}
                    label="Filter by Model"
                    onChange={(e) => setModelFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Intelligence Models</MenuItem>
                    {AVAILABLE_MODELS.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        {m.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Card>

          {/* History Grid */}
          {conversations.length === 0 && !isLoading ? (
            <EmptyState
              icon={<ChatIcon sx={{ fontSize: 40 }} />}
              title="No archived conversations"
              description="You don't have any chats matching your current filter criteria."
              actionText="Start a New Chat"
              onAction={startNewChat}
            />
          ) : (
            <Grid container spacing={2.5}>
              {conversations.map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                  <Card
                    elevation={0}
                    onClick={() => selectConversation(item.id)}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '14px',
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        borderColor: 'primary.main',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    <CardContent sx={{ flex: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                        <Chip
                          size="small"
                          label={item.modelName}
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            bgcolor: 'action.selected',
                            color: 'primary.main',
                          }}
                        />
                        <Stack direction="row" spacing={0.5} onClick={(e) => e.stopPropagation()}>
                          <IconButton
                            size="small"
                            onClick={() => togglePin(item.id)}
                            sx={{ color: item.isPinned ? 'primary.main' : 'text.disabled' }}
                          >
                            <PinnedIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => setDeleteTarget(item)}
                            sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Stack>

                      <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                        {item.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          flex: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.4,
                        }}
                      >
                        {item.preview}
                      </Typography>

                      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: 'text.disabled' }}>
                          <TimeIcon sx={{ fontSize: 15 }} />
                          <Typography variant="caption">{formatDate(item.updatedAt)}</Typography>
                        </Stack>

                        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: 'primary.main' }}>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            Open
                          </Typography>
                          <ArrowIcon sx={{ fontSize: 14 }} />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Delete Dialog */}
          <DeleteChatDialog
            open={Boolean(deleteTarget)}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleConfirmDelete}
            chatTitle={deleteTarget?.title}
            isDeleting={isDeleting}
          />
        </ResponsiveContainer>
      </ScrollContainer>
    </PageContainer>
  );
};
