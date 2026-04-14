import { z } from 'zod';

export const queryProductSchema = z.object({
  name: z.string().trim().optional(),
});
