import { OBJECT_TYPE, STRING_TYPE } from '@/utils/swagger-constants';

export const healthPaths = {
  '/health/db': {
    get: {
      tags: ['Health'],
      summary: 'Check database connection',
      responses: {
        200: {
          description: 'Database connection is healthy',
          content: {
            'application/json': {
              schema: {
                type: OBJECT_TYPE,
                properties: {
                  status: { type: STRING_TYPE, example: 'ok' },
                  database: { type: STRING_TYPE, example: 'connected' },
                },
              },
            },
          },
        },
      },
    },
  },
};
