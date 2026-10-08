import { STORAGE_KEYS } from '@/constants';
import { storage } from '@/utils/storage.utils';
import { getApiUrl } from '@/config/env';
import type {
  ChatHistoryItemType,
  ChatHistoryFilterOptions,
  RenameChatPayload,
} from '../types/historyChat.types';

// In-memory runtime session fallback
let sessionConversations: ChatHistoryItemType[] = [];

const normalizeConversation = (c: any): ChatHistoryItemType => ({
  id: c.id || c._id || `conv_${Date.now()}`,
  title: c.title || 'New Conversation',
  preview: c.preview || '',
  modelId: c.modelId || 'llama3.2',
  modelName: c.modelName || 'Llama 3.2',
  messageCount: typeof c.messageCount === 'number' ? c.messageCount : 0,
  isPinned: Boolean(c.isPinned),
  createdAt: c.createdAt || new Date().toISOString(),
  updatedAt: c.updatedAt || new Date().toISOString(),
  tags: Array.isArray(c.tags) ? c.tags : [],
});

class HistoryChatService {
  private getHeaders(): HeadersInit {
    const token = storage.get<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private hasAuth(): boolean {
    return Boolean(storage.get<string | null>(STORAGE_KEYS.AUTH_TOKEN, null));
  }

  async getConversations(filters?: ChatHistoryFilterOptions): Promise<ChatHistoryItemType[]> {
    if (this.hasAuth()) {
      try {
        const res = await fetch(getApiUrl('/api/conversations'), {
          headers: this.getHeaders(),
        });
        if (res.ok) {
          const rawData = await res.json();
          if (Array.isArray(rawData)) {
            const data: ChatHistoryItemType[] = rawData.map(normalizeConversation);
            sessionConversations = data;
            let list = [...data];

            if (filters?.searchQuery?.trim()) {
              const q = filters.searchQuery.toLowerCase().trim();
              list = list.filter(
                (item) =>
                  item.title.toLowerCase().includes(q) ||
                  item.preview.toLowerCase().includes(q) ||
                  item.tags?.some((t) => t.toLowerCase().includes(q))
              );
            }

            if (filters?.modelId) {
              list = list.filter((item) => item.modelId === filters.modelId);
            }

            if (filters?.isPinnedOnly) {
              list = list.filter((item) => item.isPinned);
            }

            return list.sort(
              (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
          }
        }
      } catch (err) {
        console.warn('Failed to fetch remote conversations, falling back to local:', err);
      }
    }

    let list = sessionConversations;
    if (filters?.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.preview.toLowerCase().includes(q)
      );
    }
    return list;
  }

  async getConversationById(id: string): Promise<ChatHistoryItemType | null> {
    if (this.hasAuth()) {
      try {
        const res = await fetch(getApiUrl(`/api/conversations/${id}`), {
          headers: this.getHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          if (data) {
            return normalizeConversation(data.conversation || data);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch remote conversation by id directly:', err);
      }
    }

    const list = await this.getConversations();
    return list.find((item) => item.id === id) || null;
  }

  async createConversation(
    data: Partial<ChatHistoryItemType> & { title: string }
  ): Promise<ChatHistoryItemType> {
    if (this.hasAuth()) {
      try {
        const res = await fetch(getApiUrl('/api/conversations'), {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const rawCreated = await res.json();
          const created = normalizeConversation(rawCreated);
          sessionConversations = [created, ...sessionConversations.filter((c) => c.id !== created.id)];
          return created;
        }
      } catch (err) {
        console.warn('Failed to create remote conversation:', err);
      }
    }

    const newConv: ChatHistoryItemType = {
      id: data.id || `conv_${Date.now()}`,
      title: data.title,
      preview: data.preview || '',
      modelId: data.modelId || 'llama3.2',
      modelName: data.modelName || 'Llama 3.2',
      messageCount: data.messageCount || 0,
      isPinned: Boolean(data.isPinned),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: data.tags || [],
    };

    sessionConversations = [newConv, ...sessionConversations];
    return newConv;
  }

  async renameConversation(payload: RenameChatPayload): Promise<ChatHistoryItemType> {
    if (this.hasAuth()) {
      try {
        const res = await fetch(getApiUrl(`/api/conversations/${payload.conversationId}`), {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify({ title: payload.newTitle }),
        });
        if (res.ok) {
          const rawUpdated = await res.json();
          const updated = normalizeConversation(rawUpdated);
          sessionConversations = sessionConversations.map((c) =>
            c.id === payload.conversationId ? updated : c
          );
          return updated;
        }
      } catch (err) {
        console.warn('Failed to rename remote conversation:', err);
      }
    }

    const index = sessionConversations.findIndex((c) => c.id === payload.conversationId);
    if (index === -1) throw new Error('Conversation not found');
    sessionConversations[index] = {
      ...sessionConversations[index],
      title: payload.newTitle,
      updatedAt: new Date().toISOString(),
    };
    return sessionConversations[index];
  }

  async togglePin(conversationId: string): Promise<ChatHistoryItemType> {
    const item = sessionConversations.find((c) => c.id === conversationId);
    const nextPinned = item ? !item.isPinned : true;

    if (this.hasAuth()) {
      try {
        const res = await fetch(getApiUrl(`/api/conversations/${conversationId}`), {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify({ isPinned: nextPinned }),
        });
        if (res.ok) {
          const rawUpdated = await res.json();
          const updated = normalizeConversation(rawUpdated);
          sessionConversations = sessionConversations.map((c) =>
            c.id === conversationId ? updated : c
          );
          return updated;
        }
      } catch (err) {
        console.warn('Failed to pin conversation on server:', err);
      }
    }

    const index = sessionConversations.findIndex((c) => c.id === conversationId);
    if (index === -1) throw new Error('Conversation not found');
    sessionConversations[index] = {
      ...sessionConversations[index],
      isPinned: nextPinned,
      updatedAt: new Date().toISOString(),
    };
    return sessionConversations[index];
  }

  async deleteConversation(conversationId: string): Promise<boolean> {
    if (this.hasAuth()) {
      try {
        await fetch(getApiUrl(`/api/conversations/${conversationId}`), {
          method: 'DELETE',
          headers: this.getHeaders(),
        });
      } catch (err) {
        console.warn('Failed to delete remote conversation:', err);
      }
    }

    sessionConversations = sessionConversations.filter((c) => c.id !== conversationId);
    return true;
  }

  async clearAllConversations(): Promise<boolean> {
    if (this.hasAuth()) {
      try {
        await fetch(getApiUrl('/api/conversations'), {
          method: 'DELETE',
          headers: this.getHeaders(),
        });
      } catch (err) {
        console.warn('Failed to clear remote conversations:', err);
      }
    }

    sessionConversations = [];
    return true;
  }
}

export const historyChatService = new HistoryChatService();
