import { z } from 'zod';
import { idParamSchema } from '@/schemas/common/params.schema';

export const queryOrdersParamsSchema = z.object({
  table_session_id: idParamSchema.shape.id,
});
