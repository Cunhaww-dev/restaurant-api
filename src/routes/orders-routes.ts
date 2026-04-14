import { Router } from 'express';
import { OrdersController } from '../controllers/orders-controller';

const ordersRoutes = Router();
const ordersController = new OrdersController();

ordersRoutes.post('/', ordersController.create);
// Pensar em como melhorar o nível de maturidade dessa rota, talvez seja melhor criar uma rota para cada recurso, por exemplo: /table-session/:table_session_id/orders
ordersRoutes.get('/table-session/:table_session_id', ordersController.index);
ordersRoutes.get('/table-session/:table_session_id/total', ordersController.show);

export { ordersRoutes };
