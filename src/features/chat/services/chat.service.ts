import { generateId } from '@/utils/string.utils';
import { AVAILABLE_MODELS, STORAGE_KEYS } from '@/constants';
import { storage } from '@/utils/storage.utils';
import { getApiUrl } from '@/config/env';
import type { ChatMessageEntity, SendMessagePayload } from '../types/chat.types';

// In-memory runtime session store fallback
const sessionMessagesMap: Record<string, ChatMessageEntity[]> = {};

class ChatService {
  private getHeaders(): HeadersInit {
    const token = storage.get<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async getMessagesByConversationId(conversationId: string): Promise<ChatMessageEntity[]> {
    const token = storage.get<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
    if (token) {
      try {
        let res = await fetch(getApiUrl(`/api/conversations/${conversationId}/messages`), {
          headers: this.getHeaders(),
        });

        if (!res.ok) {
          res = await fetch(getApiUrl(`/api/conversations/${conversationId}`), {
            headers: this.getHeaders(),
          });
        }


        if (res.ok) {
          const data = await res.json();
          const rawMsgs = Array.isArray(data)
            ? data
            : Array.isArray(data.messages)
            ? data.messages
            : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.conversation?.messages)
            ? data.conversation.messages
            : [];

          if (Array.isArray(rawMsgs) && rawMsgs.length > 0) {
            const normalized: ChatMessageEntity[] = rawMsgs.map((m: any) => ({
              id: m.id || m._id || generateId('msg'),
              conversationId: m.conversationId || conversationId,
              role: m.role || 'user',
              content: m.content || '',
              modelId: m.modelId,
              modelName: m.modelName,
              status: m.status || 'complete',
              thinking: m.thinking,
              isLiked: Boolean(m.isLiked),
              isDisliked: Boolean(m.isDisliked),
              attachments: m.attachments || [],
              webSearchUsed: Boolean(m.webSearchUsed),
              createdAt: m.createdAt || new Date().toISOString(),
              updatedAt: m.updatedAt || new Date().toISOString(),
            }));
            sessionMessagesMap[conversationId] = normalized;
            return normalized;
          }
        }
      } catch (err) {
        console.warn('Failed to fetch remote messages:', err);
      }
    }
    return sessionMessagesMap[conversationId] || [];
  }


  async saveMessage(message: ChatMessageEntity): Promise<ChatMessageEntity> {
    const current = sessionMessagesMap[message.conversationId] || [];
    
    // Check if matching message exists by ID or by role + content match
    const index = current.findIndex(
      (m) =>
        m.id === message.id ||
        (m.role === message.role &&
          m.content.trim() === message.content.trim() &&
          (m.id.startsWith('msg_u_') || message.id.startsWith('msg_u_')))
    );

    if (index >= 0) {
      current[index] = { ...current[index], ...message };
    } else {
      current.push(message);
    }

    sessionMessagesMap[message.conversationId] = current;
    return message;
  }

  async deleteMessage(conversationId: string, messageId: string): Promise<void> {
    if (sessionMessagesMap[conversationId]) {
      sessionMessagesMap[conversationId] = sessionMessagesMap[conversationId].filter(
        (m) => m.id !== messageId
      );
    }
  }

  async streamAssistantResponse(
    payload: SendMessagePayload,
    onChunk: (partialText: string, thinkingText?: string) => void,
    onComplete: (finalMessage: ChatMessageEntity) => void,
    onError: (err: Error) => void
  ): Promise<() => void> {
    let isCancelled = false;
    let accumulatedText = '';
    const abortController = new AbortController();

    const targetModel =
      AVAILABLE_MODELS.find((m) => m.id === payload.modelId) || AVAILABLE_MODELS[0];

    const modelName = targetModel.name;
    const conversationId = payload.conversationId || `conv_${Date.now()}`;

    const cancel = () => {
      if (isCancelled) return;
      isCancelled = true;
      try {
        abortController.abort();
      } catch {
        // ignore
      }

      if (accumulatedText.trim()) {
        const partialMessage: ChatMessageEntity = {
          id: generateId('msg'),
          conversationId,
          role: 'assistant',
          modelId: targetModel.id,
          modelName,
          content: accumulatedText,
          status: 'complete',
          webSearchUsed: Boolean(payload.useWebSearch),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        this.saveMessage(partialMessage);
        onComplete(partialMessage);
      }
    };

    // Prepare prompt and file context
    let promptContent = payload.content || '';
    const imageAttachments = payload.attachments?.filter((a) => a.base64) || [];
    const textAttachments = payload.attachments?.filter((a) => a.textContent) || [];

    if (textAttachments.length > 0) {
      const docsContext = textAttachments
        .map((doc) => `\n\n[Attached File: ${doc.name}]\n\`\`\`\n${doc.textContent}\n\`\`\``)
        .join('');
      promptContent = (promptContent ? `${promptContent}\n` : '') + docsContext;
    }

    if (!promptContent.trim()) {
      if (imageAttachments.length > 0) {
        promptContent = 'Please analyze the attached image.';
      } else if (textAttachments.length > 0) {
        promptContent = 'Please analyze the attached file.';
      }
    }

    // Multi-turn message history for Ollama context
    const existingMessages = sessionMessagesMap[conversationId] || [];
    const chatHistory = existingMessages.map((m) => {
      const images = m.attachments
        ?.filter((a) => Boolean(a.base64))
        .map((a) => a.base64 as string);

      return {
        role: m.role,
        content: m.content || '',
        ...(images && images.length > 0 ? { images } : {}),
      };
    });

    // If latest message is not yet in history, append it
    if (!chatHistory.some((m) => m.content === promptContent)) {
      const currentImages = imageAttachments.map((a) => a.base64 as string);
      chatHistory.push({
        role: 'user',
        content: promptContent,
        ...(currentImages.length > 0 ? { images: currentImages } : {}),
      });
    }

    const executeStream = async () => {
      try {
        accumulatedText = '';

        // Call Express backend SSE endpoint with user auth
        const response = await fetch(getApiUrl('/api/chat'), {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({
            messages: chatHistory,
            model: targetModel.id === 'llama3.2' ? 'llama3.2' : targetModel.id,
            temperature: 0.7,
            conversationId,
            userMessageContent: payload.content,

            attachments: payload.attachments,
            webSearchUsed: Boolean(payload.useWebSearch),
          }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Server error (${response.status}): ${errText}`);
        }

        if (!response.body) {
          throw new Error('ReadableStream not supported on this browser.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          if (isCancelled) break;
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data:')) continue;

            const jsonStr = trimmed.replace(/^data:\s*/, '');
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed.error) {
                accumulatedText = parsed.error;
                onChunk(accumulatedText);
                break;
              }
              if (parsed.token) {
                accumulatedText += parsed.token;
                onChunk(accumulatedText);
              }
            } catch {
              // ignore partial chunk json parse errors
            }
          }
        }

        if (isCancelled) return;

        const finalMessage: ChatMessageEntity = {
          id: generateId('msg'),
          conversationId,
          role: 'assistant',
          modelId: targetModel.id,
          modelName,
          content: accumulatedText || 'No response received from model.',
          status: 'complete',
          webSearchUsed: Boolean(payload.useWebSearch),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await this.saveMessage(finalMessage);
        onComplete(finalMessage);
      } catch (err: unknown) {
        if (!isCancelled && !(err instanceof DOMException && err.name === 'AbortError')) {
          console.error('Chat stream error:', err);
          onError(err instanceof Error ? err : new Error('Stream execution failed'));
        }
      }
    };

    executeStream();
    return cancel;
  }
}

export const chatService = new ChatService();

