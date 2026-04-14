import { z } from 'zod';

export const queryTableSessionSchema = z.object({
  status: z.enum(['open', 'closed']).optional(),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

export type QueryTableSessionDTO = z.infer<typeof queryTableSessionSchema>;
