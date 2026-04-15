import { z } from 'zod';
import { idParamSchema } from '@/schemas/common/params.schema';

export const createTableSessionSchema = z.object({
  table_id: idParamSchema.shape.id,
});
