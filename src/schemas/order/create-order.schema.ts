import { z } from 'zod';
import { idParamSchema } from '@/schemas/common/params.schema';

export const createOrderSchema = z.object({
  table_session_id: idParamSchema.shape.id,
  product_id: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive().default(1),
});

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;
