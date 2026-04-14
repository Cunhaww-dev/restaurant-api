import { createProductSchema } from '@/schemas/product/create-product.schema';

export const productPaths = {
  '/products': {
    post: {
      tags: ['Products'],
      summary: 'Create a new product',
      requestBody: {
        content: {
          'application/json': {
            schema: createProductSchema,
          },
        },
      },
      responses: {
        201: {
          description: 'Product created successfully',
        },
        400: {
          description: 'Bad request',
        },
      },
    },
  },
};
