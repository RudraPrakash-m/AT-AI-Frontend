import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AVAILABLE_MODELS } from '@/constants';
import type { ChatMessageEntity } from '../types/chat.types';
import { chatService } from '../services/chat.service';
import { historyChatService } from '@/features/historyChat/services/historyChat.service';
import { useSendMessage } from './useSendMessage';

export const useChat = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessageEntity[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>('llama3.2');
  const [conversationTitle, setConversationTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(conversationId));
  const [error, setError] = useState<string | null>(null);

  // Track newly created conversation from sendMessage to skip duplicate initial fetch
  const justCreatedConvIdRef = useRef<string | null>(null);

  // Load messages when conversationId changes (e.g. initial page load, browser refresh, or switching conversations)
  useEffect(() => {
    let isMounted = true;

    // If on new chat screen (/chat)
    if (!conversationId) {
      justCreatedConvIdRef.current = null;
      setMessages([]);
      setConversationTitle('');
      setIsLoading(false);
      setError(null);
      return;
    }

    // If this conversation was just created by sendMessage in this session,
    // skip the initial fetch because messages are already in local state and actively streaming
    if (justCreatedConvIdRef.current === conversationId) {
      justCreatedConvIdRef.current = null;
      setIsLoading(false);
      return;
    }

    const loadConversationData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [loadedMessages, conversation] = await Promise.all([
          chatService.getMessagesByConversationId(conversationId),
          historyChatService.getConversationById(conversationId),
        ]);

        if (isMounted) {
          setMessages(loadedMessages);

          if (conversation) {
            setConversationTitle(conversation.title || 'Conversation');
            setSelectedModelId(conversation.modelId || 'llama3.2');
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load conversation messages:', err);
          setError('Failed to load conversation history.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadConversationData();

    return () => {
      isMounted = false;
    };
  }, [conversationId]);

  const handleConversationCreated = useCallback(
    (newConvId: string) => {
      // Mark as just created to skip the initial fetch on the triggered navigation
      justCreatedConvIdRef.current = newConvId;
      navigate(`/chat/${newConvId}`, { replace: true });
    },
    [navigate]
  );


  const handleMessageAdded = useCallback((newMsg: ChatMessageEntity) => {
    setMessages((prev) => {
      // 1. Direct ID match -> update existing message
      const idIndex = prev.findIndex((m) => m.id === newMsg.id);
      if (idIndex !== -1) {
        const next = [...prev];
        next[idIndex] = { ...next[idIndex], ...newMsg };
        return next;
      }

      // 2. Client-optimistic temporary ID match -> reconcile with permanent server message
      const tempMatchIndex = prev.findIndex(
        (m) =>
          m.role === newMsg.role &&
          m.content.trim() === newMsg.content.trim() &&
          (m.id.startsWith('msg_u_') || m.id.startsWith('msg_temp_') || newMsg.id.startsWith('msg_u_'))
      );

      if (tempMatchIndex !== -1) {
        const next = [...prev];
        next[tempMatchIndex] = { ...next[tempMatchIndex], ...newMsg };
        return next;
      }

      return [...prev, newMsg];
    });
  }, []);

  const {
    sendMessage: executeSend,
    stopStreaming,
    isStreaming,
    streamingText,
    streamingThinking,
  } = useSendMessage({
    onConversationCreated: handleConversationCreated,
    onMessageAdded: handleMessageAdded,
  });

  const sendMessage = useCallback(
    async (params: {
      message: string;
      attachments?: ChatMessageEntity['attachments'];
      useWebSearch?: boolean;
      useDeepThinking?: boolean;
    }) => {
      await executeSend({
        conversationId: conversationId || undefined,
        content: params.message,
        modelId: selectedModelId,
        attachments: params.attachments,
        useWebSearch: params.useWebSearch,
        useDeepThinking: params.useDeepThinking,
      });
    },
    [conversationId, selectedModelId, executeSend]
  );

  const editMessage = useCallback(
    async (messageId: string, newContent: string) => {
      const targetIndex = messages.findIndex((m) => m.id === messageId);
      if (targetIndex === -1) return;

      const updatedMessages = messages.slice(0, targetIndex);
      setMessages(updatedMessages);

      await executeSend({
        conversationId: conversationId || undefined,
        content: newContent,
        modelId: selectedModelId,
      });
    },
    [messages, conversationId, selectedModelId, executeSend]
  );

  const regenerateResponse = useCallback(
    async (messageId: string) => {
      const targetIndex = messages.findIndex((m) => m.id === messageId);
      if (targetIndex === -1) return;

      const userMsg = messages[targetIndex - 1];
      if (!userMsg) return;

      const trimmedMessages = messages.slice(0, targetIndex);
      setMessages(trimmedMessages);

      await executeSend({
        conversationId: conversationId || undefined,
        content: userMsg.content,
        modelId: selectedModelId,
      });
    },
    [messages, conversationId, selectedModelId, executeSend]
  );


  const toggleLike = useCallback(
    async (messageId: string) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === messageId) {
            const updated = { ...m, isLiked: !m.isLiked, isDisliked: false };
            chatService.saveMessage(updated);
            return updated;
          }
          return m;
        })
      );
    },
    []
  );

  const toggleDislike = useCallback(
    async (messageId: string) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === messageId) {
            const updated = { ...m, isDisliked: !m.isDisliked, isLiked: false };
            chatService.saveMessage(updated);
            return updated;
          }
          return m;
        })
      );
    },
    []
  );

  const activeModel =
    AVAILABLE_MODELS.find((m) => m.id === selectedModelId) || AVAILABLE_MODELS[0];

  return {
    conversationId,
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
  };
};

