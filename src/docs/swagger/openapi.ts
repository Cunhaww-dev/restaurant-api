import { createDocument } from 'zod-openapi';
import { productPaths } from './paths/product.paths';
import { orderPaths } from './paths/order.path';
import { tablePaths } from './paths/table.path';
import { tableSessionPaths } from './paths/table-session.path';
import { healthPaths } from './paths/health.path';

// Aqui você vai centralizar tudo
export const document = createDocument({
  openapi: '3.0.0',
  info: {
    title: 'Restaurant API',
    version: '1.0.0',
    description: 'API for restaurant management',
  },
  tags: [
    { name: 'Health', description: 'Health check operations' },
    { name: 'Products', description: 'Operations related to products' },
    { name: 'Tables', description: 'Operations related to tables' },
    {
      name: 'Table Sessions',
      description: 'Operations related to table sessions',
    },
    { name: 'Orders', description: 'Operations related to orders' },
  ],
  paths: {
    ...healthPaths,
    ...productPaths,
    ...orderPaths,
    ...tableSessionPaths,
    ...tablePaths,
  },
});
