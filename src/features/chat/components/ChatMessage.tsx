import React from 'react';
import { Box } from '@mui/material';
import type { ChatMessageEntity } from '../types/chat.types';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';

interface ChatMessageProps {
  message: ChatMessageEntity;
  userName?: string;
  onEditSubmit?: (newContent: string) => void;
  onRegenerate?: () => void;
  onLikeToggle?: () => void;
  onDislikeToggle?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  userName,
  onEditSubmit,
  onRegenerate,
  onLikeToggle,
  onDislikeToggle,
}) => {
  return (
    <Box sx={{ width: '100%', mb: 1 }}>
      {message.role === 'user' ? (
        <UserMessage
          message={message}
          userName={userName}
          onEditSubmit={onEditSubmit}
        />
      ) : (
        <AssistantMessage
          message={message}
          onRegenerate={onRegenerate}
          onLikeToggle={onLikeToggle}
          onDislikeToggle={onDislikeToggle}
        />
      )}
    </Box>
  );
};
