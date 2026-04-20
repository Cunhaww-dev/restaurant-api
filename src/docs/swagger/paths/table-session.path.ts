import { createTableSessionSchema } from '@/schemas/tables-sessions/create-table-session.schema';
import {
  QUERY,
  PATH,
  STRING_TYPE,
  NUMBER_TYPE,
} from '@/utils/swagger-constants';

export const tableSessionPaths = {
  '/tables-sessions': {
    get: {
      tags: ['Table Sessions'],
      summary: 'List table sessions',
      parameters: [
        {
          name: 'status',
          in: QUERY,
          required: false,
          schema: {
            type: STRING_TYPE,
            enum: ['open', 'closed'],
          },
        },
        {
          name: 'limit',
          in: QUERY,
          required: false,
          schema: {
            type: NUMBER_TYPE,
            default: 50,
          },
        },
      ],
      responses: {
        200: {
          description: 'List of table sessions',
        },
      },
    },

    post: {
      tags: ['Table Sessions'],
      summary: 'Create a table session',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: createTableSessionSchema,
          },
        },
      },
      responses: {
        201: {
          description: 'Table session created',
        },
        400: {
          description: 'Table already has an open session',
        },
      },
    },
  },

  '/tables-sessions/{id}': {
    patch: {
      tags: ['Table Sessions'],
      summary: 'Close a table session',
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
        200: {
          description: 'Table session closed successfully',
        },
        400: {
          description: 'Table session is already closed',
        },
        404: {
          description: 'Table session not found',
        },
      },
    },
  },
};
