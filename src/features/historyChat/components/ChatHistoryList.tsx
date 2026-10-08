import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ChatBubbleOutlined as EmptyChatIcon } from '@mui/icons-material';
import { AppSkeleton } from '@/components/common/ui/AppSkeleton';
import type {
  ChatHistoryGroupType,
  ChatHistoryItemType,
} from '../types/historyChat.types';
import { ChatHistoryGroup } from './ChatHistoryGroup';
import { DeleteChatDialog } from './DeleteChatDialog';

interface ChatHistoryListProps {
  groups: ChatHistoryGroupType[];
  isLoading: boolean;
  activeId?: string;
  collapsed?: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, newTitle: string) => Promise<void>;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
}

export const ChatHistoryList: React.FC<ChatHistoryListProps> = ({
  groups,
  isLoading,
  activeId,
  collapsed = false,
  onSelect,
  onRename,
  onTogglePin,
  onDelete,
}) => {
  const [deleteTarget, setDeleteTarget] = useState<ChatHistoryItemType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePrompt = (item: ChatHistoryItemType) => {
    setDeleteTarget(item);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await onDelete(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 1.5 }}>
        <AppSkeleton variant="history-item" count={6} />
      </Box>
    );
  }

  const hasItems = groups.some((g) => g.items.length > 0);

  if (!hasItems) {
    if (collapsed) return null;
    return (
      <Box sx={{ py: 4, px: 2, textAlign: 'center' }}>
        <EmptyChatIcon sx={{ color: 'text.disabled', fontSize: 32, mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          No conversations found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {groups.map((group) => (
        <ChatHistoryGroup
          key={group.label}
          group={group}
          activeId={activeId}
          collapsed={collapsed}
          onSelect={onSelect}
          onRename={onRename}
          onTogglePin={onTogglePin}
          onDeletePrompt={handleDeletePrompt}
        />
      ))}

      {/* Delete Chat Confirmation Dialog */}
      <DeleteChatDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        chatTitle={deleteTarget?.title}
        isDeleting={isDeleting}
      />
    </Box>
  );
};
