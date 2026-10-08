import type { BaseEntity } from '@/types';

export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageStatus = 'sending' | 'streaming' | 'complete' | 'error';

export interface ChatAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  base64?: string;
  textContent?: string;
}

export interface ChatMessageEntity extends BaseEntity {
  conversationId: string;
  role: MessageRole;
  content: string;
  modelId?: string;
  modelName?: string;
  status: MessageStatus;
  thinking?: string;
  isLiked?: boolean;
  isDisliked?: boolean;
  attachments?: ChatAttachment[];
  webSearchUsed?: boolean;
}

export interface SendMessagePayload {
  conversationId?: string;
  content: string;
  modelId: string;
  attachments?: ChatAttachment[];
  useWebSearch?: boolean;
  useDeepThinking?: boolean;
}

export interface ChatConversationState {
  id: string;
  title: string;
  modelId: string;
  messages: ChatMessageEntity[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
}
