import { z } from 'zod';

export const settingsSchema = z.object({
  themeMode: z.enum(['light', 'dark', 'system']),
  fontSize: z.enum(['small', 'medium', 'large']),
  sendOnEnter: z.boolean(),
  codeHighlighting: z.boolean(),
  streamResponses: z.boolean(),
  defaultModel: z.string().min(1),
  temperature: z.number().min(0).max(2),
  topP: z.number().min(0).max(1),
  systemPrompt: z.string().max(2000),
  enableTelemetry: z.boolean(),
  enableMemory: z.boolean(),
  soundEffects: z.boolean(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
