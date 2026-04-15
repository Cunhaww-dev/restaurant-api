export const healthPaths = {
  '/health/db': {
    get: {
      tags: ['Health'],
      summary: 'Check database connection',
      responses: {
        200: {
          description: 'Database connection is healthy',
        },
      },
    },
  },
};
