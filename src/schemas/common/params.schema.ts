import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive('ID must be a positive integer'),
});

export type IdParamDTO = z.infer<typeof idParamSchema>;
