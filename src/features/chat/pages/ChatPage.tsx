import React, { useState, useRef, useEffect } from 'react';
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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const userScrolledUpRef = useRef<boolean>(false);
  const [showScrollBottom, setShowScrollBottom] = useState<boolean>(false);

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

  const prevMsgCountRef = useRef<number>(messages.length);

  // Monitor scroll position in the main scroll container
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const isAtBottom = distanceFromBottom < 90;

      if (isAtBottom) {
        userScrolledUpRef.current = false;
        setShowScrollBottom(false);
      } else {
        userScrolledUpRef.current = true;
        setShowScrollBottom(true);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // When a new message is sent or loaded, auto-scroll to bottom
  useEffect(() => {
    if (messages.length > prevMsgCountRef.current) {
      userScrolledUpRef.current = false;
      setShowScrollBottom(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
    prevMsgCountRef.current = messages.length;
  }, [messages.length]);

  // Streaming auto-scroll: ONLY scroll down if user has NOT scrolled up
  useEffect(() => {
    if (isStreaming && !userScrolledUpRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [streamingText, isStreaming]);

  const handleScrollToBottom = () => {
    userScrolledUpRef.current = false;
    setShowScrollBottom(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

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
      <ScrollContainer ref={scrollContainerRef}>
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
        showScrollBottom={showScrollBottom}
        onScrollToBottom={handleScrollToBottom}
      />
    </PageContainer>
  );
};

