import { createProductSchema } from '@/schemas/product/create-product.schema';
import { updateProductSchema } from '@/schemas/product/update-product.schema';
import { PATH, NUMBER_TYPE } from '@/utils/swagger-constants';

export const productPaths = {
  '/products': {
    get: {
      tags: ['Products'],
      summary: 'List all products',
      responses: {
        200: {
          description: 'List of products',
        },
      },
    },
    post: {
      tags: ['Products'],
      summary: 'Create a new product',
      requestBody: {
        required: true,
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
  '/products/{id}': {
    put: {
      tags: ['Products'],
      summary: 'Update a product',
      parameters: [
        {
          name: 'id',
          in: PATH,
          required: true,
          schema: {
            type: NUMBER_TYPE,
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: updateProductSchema,
          },
        },
      },
      responses: {
        200: {
          description: 'Product updated successfully',
        },
        400: {
          description: 'Bad request',
        },
        404: {
          description: 'Product not found',
        },
      },
    },
    delete: {
      tags: ['Products'],
      summary: 'Delete a product',
      parameters: [
        {
          name: 'id',
          in: PATH,
          required: true,
          schema: {
            type: NUMBER_TYPE,
          },
        },
      ],
      responses: {
        204: {
          description: 'Product deleted successfully',
        },
        404: {
          description: 'Product not found',
        },
      },
    },
  },
};
