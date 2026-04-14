import { createDocument } from 'zod-openapi';
import { productPaths } from './product.paths';

// Aqui você vai centralizar tudo
export const document = createDocument({
  openapi: '3.0.0',
  info: {
    title: 'Restaurant API',
    version: '1.0.0',
    description: 'API for restaurant management',
  },
  paths: {
    ...productPaths,
  }, // vamos preencher depois
});
