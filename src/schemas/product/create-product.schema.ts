import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().trim().min(5, 'Name must be at least 5 characters'),
  price: z.coerce.number().gt(0, 'Price must be greater than 0'),
});

// Tipo interno derivado do schema, usado fora do controller (ex: services)
export type CreateProductDTO = z.infer<typeof createProductSchema>;
