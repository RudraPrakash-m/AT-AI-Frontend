import { useState, useRef, useCallback, useEffect } from 'react';
import { generateId } from '@/utils/string.utils';
import { AVAILABLE_MODELS } from '@/constants';
import type { ChatMessageEntity, SendMessagePayload } from '../types/chat.types';
import { chatService } from '../services/chat.service';
import { historyChatService } from '@/features/historyChat/services/historyChat.service';

interface UseSendMessageProps {
  onConversationCreated?: (conversationId: string) => void;
  onMessageAdded?: (message: ChatMessageEntity) => void;
}

export const useSendMessage = ({
  onConversationCreated,
  onMessageAdded,
}: UseSendMessageProps = {}) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [streamingThinking, setStreamingThinking] = useState('');
  const cancelStreamRef = useRef<(() => void) | null>(null);
  const isExecutingRef = useRef(false);

  // Clean up any ongoing stream on unmount
  useEffect(() => {
    return () => {
      if (cancelStreamRef.current) {
        cancelStreamRef.current();
        cancelStreamRef.current = null;
      }
    };
  }, []);

  const sendMessage = useCallback(
    async (payload: SendMessagePayload) => {
      if (isExecutingRef.current) return;
      isExecutingRef.current = true;

      try {
        let currentConvId = payload.conversationId;

        if (!currentConvId) {
          const selectedModel =
            AVAILABLE_MODELS.find((m) => m.id === payload.modelId) || AVAILABLE_MODELS[0];

          const convTitle =
            payload.content.trim() ||
            payload.attachments?.[0]?.name ||
            'New Conversation';

          const newConv = await historyChatService.createConversation({
            title: convTitle.slice(0, 48),
            preview: convTitle.slice(0, 100),
            modelId: selectedModel.id,
            modelName: selectedModel.name,
            messageCount: 2,
          });
          currentConvId = newConv.id;
          if (onConversationCreated) {
            onConversationCreated(currentConvId);
          }
        }

        const userMessage: ChatMessageEntity = {
          id: generateId('msg_u'),
          conversationId: currentConvId,
          role: 'user',
          content: payload.content,
          attachments: payload.attachments,
          status: 'complete',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await chatService.saveMessage(userMessage);
        if (onMessageAdded) {
          onMessageAdded(userMessage);
        }

        setIsStreaming(true);
        setStreamingText('');
        setStreamingThinking('');

        const cancelFn = await chatService.streamAssistantResponse(
          {
            ...payload,
            conversationId: currentConvId,
          },
          (chunkText, thinkingText) => {
            setStreamingText(chunkText);
            if (thinkingText) setStreamingThinking(thinkingText);
          },
          (finalMessage) => {
            setIsStreaming(false);
            setStreamingText('');
            setStreamingThinking('');
            cancelStreamRef.current = null;
            isExecutingRef.current = false;
            if (onMessageAdded) {
              onMessageAdded(finalMessage);
            }
          },
          (error) => {
            console.error('Streaming error:', error);
            setIsStreaming(false);
            setStreamingText('');
            setStreamingThinking('');
            cancelStreamRef.current = null;
            isExecutingRef.current = false;
            const errorMessage: ChatMessageEntity = {
              id: generateId('msg_err'),
              conversationId: currentConvId!,
              role: 'assistant',
              content: 'Sorry, I encountered an issue processing your request. Please check that Ollama is running and try again.',
              status: 'error',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            chatService.saveMessage(errorMessage);
            if (onMessageAdded) {
              onMessageAdded(errorMessage);
            }
          }
        );

        cancelStreamRef.current = cancelFn;
      } catch (err) {
        console.error('Failed to initiate send message:', err);
        setIsStreaming(false);
        isExecutingRef.current = false;
      }
    },
    [onConversationCreated, onMessageAdded]
  );

  const stopStreaming = useCallback(() => {
    if (cancelStreamRef.current) {
      cancelStreamRef.current();
      cancelStreamRef.current = null;
    }
    setIsStreaming(false);
    isExecutingRef.current = false;
  }, []);

  return {
    sendMessage,
    stopStreaming,
    isStreaming,
    streamingText,
    streamingThinking,
  };
};

