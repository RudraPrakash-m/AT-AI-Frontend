import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatRelativeChatDate } from '@/utils/date.utils';
import type {
  ChatHistoryItemType,
  ChatHistoryGroupType,
  ChatHistoryFilterOptions,
} from '../types/historyChat.types';
import { historyChatService } from '../services/historyChat.service';

export const useChatHistory = (filterOptions?: ChatHistoryFilterOptions) => {
  const initialCache = historyChatService.getCachedConversations();
  const [conversations, setConversations] = useState<ChatHistoryItemType[]>(initialCache);
  const [isLoading, setIsLoading] = useState<boolean>(initialCache.length === 0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId?: string }>();

  const searchQuery = filterOptions?.searchQuery || '';
  const modelId = filterOptions?.modelId || '';
  const isPinnedOnly = Boolean(filterOptions?.isPinnedOnly);

  const loadConversations = useCallback(
    async (showLoadingSpinner = false) => {
      try {
        if (showLoadingSpinner) {
          setIsLoading(true);
        }
        setError(null);
        const data = await historyChatService.getConversations({
          searchQuery: searchQuery || undefined,
          modelId: modelId || undefined,
          isPinnedOnly: isPinnedOnly || undefined,
        });
        setConversations(data);
      } catch (err) {
        console.error('Failed to load conversations:', err);
        setError('Unable to load chat history.');
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery, modelId, isPinnedOnly]
  );

  // Load once on mount or when filter options change
  useEffect(() => {
    loadConversations(conversations.length === 0);
  }, [loadConversations, searchQuery, modelId, isPinnedOnly]);

  // Sync across all mounted sidebars instantly
  useEffect(() => {
    const handleSync = () => {
      const cached = historyChatService.getCachedConversations();
      if (cached && cached.length > 0) {
        setConversations(cached);
        setIsLoading(false);
      } else {
        loadConversations(false);
      }
    };

    window.addEventListener('chat:history:updated', handleSync);
    return () => window.removeEventListener('chat:history:updated', handleSync);
  }, [loadConversations]);



  const groupedConversations = useMemo<ChatHistoryGroupType[]>(() => {
    const groupsMap = new Map<string, ChatHistoryItemType[]>();
    const order = ['Today', 'Yesterday', 'Previous 7 Days', 'Previous 30 Days', 'Older'];

    conversations.forEach((conv) => {
      const groupKey = formatRelativeChatDate(conv.updatedAt);
      if (!groupsMap.has(groupKey)) {
        groupsMap.set(groupKey, []);
      }
      groupsMap.get(groupKey)?.push(conv);
    });

    const result: ChatHistoryGroupType[] = [];
    order.forEach((label) => {
      if (groupsMap.has(label)) {
        result.push({
          label,
          items: groupsMap.get(label) || [],
        });
        groupsMap.delete(label);
      }
    });

    // Any remaining custom dates
    groupsMap.forEach((items, label) => {
      result.push({ label, items });
    });

    return result;
  }, [conversations]);

  const selectConversation = useCallback(
    (id: string) => {
      navigate(`/chat/${id}`);
    },
    [navigate]
  );

  const startNewChat = useCallback(() => {
    navigate('/chat');
  }, [navigate]);

  const renameConversation = useCallback(
    async (id: string, newTitle: string) => {
      try {
        const updated = await historyChatService.renameConversation({
          conversationId: id,
          newTitle,
        });
        setConversations((prev) =>
          prev.map((item) => (item.id === id ? updated : item))
        );
      } catch (err) {
        console.error('Failed to rename conversation', err);
        throw err;
      }
    },
    []
  );

  const togglePin = useCallback(async (id: string) => {
    try {
      const updated = await historyChatService.togglePin(id);
      setConversations((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
    } catch (err) {
      console.error('Failed to pin conversation', err);
    }
  }, []);

  const deleteConversation = useCallback(
    async (id: string) => {
      try {
        await historyChatService.deleteConversation(id);
        setConversations((prev) => prev.filter((item) => item.id !== id));
        if (conversationId === id) {
          navigate('/chat');
        }
      } catch (err) {
        console.error('Failed to delete conversation', err);
        throw err;
      }
    },
    [conversationId, navigate]
  );

  return {
    conversations,
    groupedConversations,
    activeConversationId: conversationId,
    isLoading,
    error,
    refreshHistory: loadConversations,
    selectConversation,
    startNewChat,
    renameConversation,
    togglePin,
    deleteConversation,
  };
};
