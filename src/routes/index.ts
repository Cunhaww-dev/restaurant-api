import { Router } from 'express';
import { knex } from '@/database/knex';
import { productsRoutes } from './products-routes';
import { tablesRoutes } from './tables-routes';
import { tablesSessionsRoutes } from './tables-session-routes';
import { ordersRoutes } from './orders-routes';

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
routes.use('/tables', tablesRoutes);
routes.use('/tables-sessions', tablesSessionsRoutes);
routes.use('/orders', ordersRoutes);

export { routes };
