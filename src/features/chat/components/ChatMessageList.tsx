import React from 'react';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import type { ChatMessageEntity } from '../types/chat.types';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import aashditLogo from '@/assets/aashditLogo-removebg-preview.png';

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
  onSelectPrompt: _onSelectPrompt,
  onEditMessage,
  onRegenerate,
  onLikeToggle,
  onDislikeToggle,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (messages.length === 0 && !isStreaming) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          minHeight: '60vh',
          userSelect: 'none',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Box
          component="img"
          src={aashditLogo}
          alt="Aashdit Logo Watermark"
          sx={{
            width: { xs: 84, sm: 110, md: 128 },
            height: { xs: 84, sm: 110, md: 128 },
            objectFit: 'contain',
            filter: isDark
              ? 'drop-shadow(0 8px 30px rgba(0, 163, 255, 0.45)) drop-shadow(0 2px 10px rgba(245, 158, 11, 0.35))'
              : 'drop-shadow(0 8px 24px rgba(2, 132, 199, 0.2))',
            transition: 'all 0.3s ease',
            mb: 2,
          }}
        />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            letterSpacing: '-0.02em',
            background: isDark
              ? 'linear-gradient(135deg, #00A3FF 0%, #38BDF8 50%, #F59E0B 100%)'
              : 'linear-gradient(135deg, #0284C7 0%, #0369A1 50%, #D97706 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 0.75,
          }}
        >
          What would you like to explore today?
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            maxWidth: 480,
            fontSize: { xs: '0.82rem', sm: '0.9rem' },
            lineHeight: 1.5,
          }}
        >
          Powered by AT AI Workspace with real-time reasoning, vision, and deep search capabilities.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 840,
        mx: 'auto',
        px: { xs: 1.25, sm: 2.5, md: 3 },
        py: { xs: 1.5, sm: 2.5 },
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        position: 'relative',
      }}
    >
      <Stack spacing={{ xs: 1.5, sm: 2 }} sx={{ width: '100%' }}>
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
      </Stack>
    </Box>
  );
};


