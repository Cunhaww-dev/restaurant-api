import { createOrderSchema } from '@/schemas/order/create-order.schema';
import { PATH, NUMBER_TYPE } from '@/utils/swagger-constants';

export const orderPaths = {
  '/orders/table-session/{table_session_id}': {
    get: {
      tags: ['Orders'],
      summary: 'List orders by table session',
      parameters: [
        {
          name: 'table_session_id',
          in: PATH,
          required: true,
          schema: {
            type: NUMBER_TYPE,
          },
        },
      ],
      responses: {
        200: {
          description: 'List of orders',
        },
      },
    },
  },

  '/orders/table-session/{table_session_id}/total': {
    get: {
      tags: ['Orders'],
      summary: 'Get total amount for a table session',
      parameters: [
        {
          name: 'table_session_id',
          in: PATH,
          required: true,
          schema: {
            type: NUMBER_TYPE,
          },
        },
      ],
      responses: {
        200: {
          description: 'Total amount for the session',
        },
        404: {
          description: 'Table session not found',
        },
      },
    },
  },

  '/orders': {
    post: {
      tags: ['Orders'],
      summary: 'Create a new order',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: createOrderSchema,
          },
        },
      },
      responses: {
        201: {
          description: 'Order created successfully',
        },
        400: {
          description: 'Validation error',
        },
      },
    },
  },
};
