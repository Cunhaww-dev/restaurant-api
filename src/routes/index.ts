import { Router } from 'express';
import { knex } from '@/database/knex';
import { productsRoutes } from './products-routes';

const routes = Router();

routes.get('/health/db', async (_request, response, next) => {
  try {
    await knex.raw('select 1');

    return response.json({
      status: 'ok',
      database: 'connected',
    });
  } catch (error) {
    next(error);
  }
});

routes.use('/products', productsRoutes);

export { routes };
