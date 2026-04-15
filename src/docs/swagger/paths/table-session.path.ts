import { createTableSessionSchema } from '@/schemas/tables-sessions/create-table-session.schema';
import {
  QUERY,
  PATH,
  STRING_TYPE,
  NUMBER_TYPE,
} from '@/utils/swagger-constants';

export const tableSessionPaths = {
  '/table-sessions': {
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
          description: 'Validation error',
        },
      },
    },
  },

  '/table-sessions/{table_session_id}': {
    get: {
      tags: ['Table Sessions'],
      summary: 'Get table session summary',
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
          description: 'Session summary',
        },
      },
    },
    patch: {
      tags: ['Table Sessions'],
      summary: 'Update a table session',
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
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: createTableSessionSchema,
          },
        },
      },
      responses: {
        200: {
          description: 'Table session updated successfully',
        },
        400: {
          description: 'Validation error',
        },
        404: {
          description: 'Table session not found',
        },
      },
    },
  },
};
