import React, { useRef, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import type { ChatMessageEntity } from '../types/chat.types';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { SuggestedPrompts } from './SuggestedPrompts';

interface ChatMessageListProps {
  messages: ChatMessageEntity[];
  isStreaming?: boolean;
  streamingText?: string;
  streamingThinking?: string;
  activeModelName?: string;
  userName?: string;
  onSelectPrompt: (prompt: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onRegenerate: (messageId: string) => void;
  onLikeToggle: (messageId: string) => void;
  onDislikeToggle: (messageId: string) => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isStreaming = false,
  streamingText = '',
  streamingThinking = '',
  activeModelName = 'AT AI 4.5',
  userName = 'Rudra',
  onSelectPrompt,
  onEditMessage,
  onRegenerate,
  onLikeToggle,
  onDislikeToggle,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages.length, streamingText, isStreaming]);

  if (messages.length === 0 && !isStreaming) {
    return <SuggestedPrompts onSelectPrompt={onSelectPrompt} />;
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 820,
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        py: 2,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}
    >
      <Stack spacing={2} sx={{ width: '100%' }}>
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            userName={userName}
            onEditSubmit={
              msg.role === 'user' ? (newText) => onEditMessage(msg.id, newText) : undefined
            }
            onRegenerate={
              msg.role === 'assistant' ? () => onRegenerate(msg.id) : undefined
            }
            onLikeToggle={
              msg.role === 'assistant' ? () => onLikeToggle(msg.id) : undefined
            }
            onDislikeToggle={
              msg.role === 'assistant' ? () => onDislikeToggle(msg.id) : undefined
            }
          />
        ))}

        {/* Real-time in-flight streaming assistant response message */}
        {isStreaming && Boolean(streamingText) && (
          <ChatMessage
            message={{
              id: 'streaming_temp_msg',
              conversationId: 'temp',
              role: 'assistant',
              content: streamingText,
              thinking: streamingThinking || undefined,
              modelName: activeModelName,
              status: 'streaming',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }}
          />
        )}

        {isStreaming && !streamingText && <TypingIndicator />}

        <div ref={bottomRef} style={{ height: 1 }} />
      </Stack>
    </Box>
  );
};
