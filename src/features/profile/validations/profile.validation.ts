import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  jobTitle: z.string().max(80).optional(),
  organization: z.string().max(80).optional(),
  bio: z.string().max(300).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const createApiKeySchema = z.object({
  name: z.string().min(1, 'API Key name is required').max(50),
});

export type CreateApiKeyFormData = z.infer<typeof createApiKeySchema>;
