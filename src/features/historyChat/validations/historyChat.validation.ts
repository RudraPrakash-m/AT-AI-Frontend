import { z } from 'zod';

export const renameChatSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(100, 'Title cannot exceed 100 characters')
    .trim(),
});

export type RenameChatFormData = z.infer<typeof renameChatSchema>;

export const searchChatSchema = z.object({
  query: z.string().max(100).optional(),
});
