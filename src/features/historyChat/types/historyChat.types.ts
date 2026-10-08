import type { BaseEntity } from '@/types';

export interface ChatHistoryItemType extends BaseEntity {
  title: string;
  preview: string;
  modelId: string;
  modelName: string;
  messageCount: number;
  isPinned?: boolean;
  folderId?: string;
  tags?: string[];
}

export interface ChatHistoryGroupType {
  label: string; // 'Today', 'Yesterday', 'Previous 7 Days', 'Previous 30 Days', 'Older'
  items: ChatHistoryItemType[];
}

export interface ChatHistoryFilterOptions {
  searchQuery?: string;
  modelId?: string;
  isPinnedOnly?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface RenameChatPayload {
  conversationId: string;
  newTitle: string;
}
