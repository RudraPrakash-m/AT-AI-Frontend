import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import { PageContainer } from '@/components/common/layout/PageContainer';
import { ScrollContainer } from '@/components/common/layout/ScrollContainer';
import { AppSkeleton } from '@/components/common/ui/AppSkeleton';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { ChatHeader } from '../components/ChatHeader';
import { ChatMessageList } from '../components/ChatMessageList';
import { ChatInput } from '../components/ChatInput';
import { useChat } from '../hooks/useChat';

interface ChatPageProps {
  onOpenMobileMenu?: () => void;
  onOpenSettingsModal?: () => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  onOpenMobileMenu,
  onOpenSettingsModal,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');

  const {
    conversationTitle,
    messages,
    selectedModelId,
    activeModel,
    setSelectedModelId,
    isLoading,
    isStreaming,
    streamingText,
    streamingThinking,
    error,
    sendMessage,
    stopStreaming,
    editMessage,
    regenerateResponse,
    toggleLike,
    toggleDislike,
  } = useChat();

  const handleSelectPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
  };

  const handleNewChat = () => {
    navigate('/chat');
  };

  return (
    <PageContainer>
      {/* Top Conversation Header Bar */}
      <ChatHeader
        conversationTitle={conversationTitle}
        selectedModelId={selectedModelId}
        onModelChange={setSelectedModelId}
        onNewChat={handleNewChat}
        onOpenMobileMenu={onOpenMobileMenu}
        onOpenSettingsModal={onOpenSettingsModal}
      />

      {/* Main Conversation Body */}
      <ScrollContainer>
        {error && (
          <Box sx={{ p: 2, maxWidth: 820, mx: 'auto', width: '100%' }}>
            <Alert severity="error" sx={{ borderRadius: '12px' }}>
              {error}
            </Alert>
          </Box>
        )}

        {isLoading ? (
          <Box sx={{ p: 4, maxWidth: 820, mx: 'auto', width: '100%' }}>
            <AppSkeleton variant="message" count={3} />
          </Box>
        ) : (
          <ChatMessageList
            messages={messages}
            isStreaming={isStreaming}
            streamingText={streamingText}
            streamingThinking={streamingThinking}
            activeModelName={activeModel.name}
            userName={user?.name || 'Rudra'}
            onSelectPrompt={handleSelectPrompt}
            onEditMessage={editMessage}
            onRegenerate={regenerateResponse}
            onLikeToggle={toggleLike}
            onDislikeToggle={toggleDislike}
          />
        )}
      </ScrollContainer>

      {/* Bottom Sticky Input */}
      <ChatInput
        onSendMessage={sendMessage}
        onStopStreaming={stopStreaming}
        isStreaming={isStreaming}
        disabled={isLoading}
        initialValue={selectedPrompt}
      />
    </PageContainer>
  );
};
