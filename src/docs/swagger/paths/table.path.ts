import {
  STRING_TYPE,
  NUMBER_TYPE,
  ARRAY_TYPE,
  OBJECT_TYPE,
} from '@/utils/swagger-constants';

export const tablePaths = {
  '/tables': {
    get: {
      tags: ['Tables'],
      summary: 'List all tables',
      responses: {
        200: {
          description: 'List of tables',
          content: {
            'application/json': {
              schema: {
                type: ARRAY_TYPE,
                items: {
                  type: OBJECT_TYPE,
                  properties: {
                    id: { type: NUMBER_TYPE },
                    table_number: { type: NUMBER_TYPE },
                    created_at: { type: STRING_TYPE, format: 'date-time' },
                    updated_at: { type: STRING_TYPE, format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
