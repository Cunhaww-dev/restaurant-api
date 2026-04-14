import { z } from 'zod';

export const updateProductSchema = z.object({
  name: z.string().trim().min(5, 'Name must be at least 5 characters'),
  price: z.coerce.number().gt(0, 'Price must be greater than 0'),
});

export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
