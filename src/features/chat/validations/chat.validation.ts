import { z } from 'zod';
import { CHAT_CONFIG } from '../constants/chat.constants';

export const chatInputSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(CHAT_CONFIG.MAX_MESSAGE_LENGTH, `Message exceeds maximum ${CHAT_CONFIG.MAX_MESSAGE_LENGTH} characters`),
});

export type ChatInputFormData = z.infer<typeof chatInputSchema>;
