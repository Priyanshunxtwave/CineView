import { z } from 'zod';

export const CredentialsSchema = z.object({
  username: z.string().min(1).email(),
  password: z.string().min(6),
});

export type CredentialsFormData = z.infer<typeof CredentialsSchema>;