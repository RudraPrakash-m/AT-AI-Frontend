import React from 'react';
import { Box, Typography, List } from '@mui/material';
import type {
  ChatHistoryGroupType,
  ChatHistoryItemType,
} from '../types/historyChat.types';
import { ChatHistoryItem } from './ChatHistoryItem';

interface ChatHistoryGroupProps {
  group: ChatHistoryGroupType;
  activeId?: string;
  collapsed?: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, newTitle: string) => Promise<void>;
  onTogglePin: (id: string) => void;
  onDeletePrompt: (item: ChatHistoryItemType) => void;
}

export const ChatHistoryGroup: React.FC<ChatHistoryGroupProps> = ({
  group,
  activeId,
  collapsed = false,
  onSelect,
  onRename,
  onTogglePin,
  onDeletePrompt,
}) => {
  if (group.items.length === 0) return null;

  return (
    <Box sx={{ mb: 1.5 }}>
      {!collapsed && (
        <Typography
          variant="caption"
          sx={{
            px: 1.25,
            py: 0.5,
            display: 'block',
            fontWeight: 600,
            fontSize: '0.68rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'text.secondary',
            opacity: 0.65,
          }}
        >
          {group.label}
        </Typography>
      )}

      <List disablePadding>
        {group.items.map((item) => (
          <ChatHistoryItem
            key={item.id}
            item={item}
            isActive={item.id === activeId}
            collapsed={collapsed}
            onSelect={onSelect}
            onRename={onRename}
            onTogglePin={onTogglePin}
            onDeletePrompt={onDeletePrompt}
          />
        ))}
      </List>
    </Box>
  );
};
