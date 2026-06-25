import { z } from 'zod';

export const CredentialsSchema = z.object({
  username: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

// Infer the TypeScript type directly from the Zod schema
export type CredentialsFormData = z.infer<typeof CredentialsSchema>;