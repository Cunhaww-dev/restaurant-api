import { Request, Response, NextFunction } from 'express';
import { createOrderSchema } from '@/schemas/order/create-order.schema';
import { queryOrdersParamsSchema } from '@/schemas/order/query-orders.schema';
import { orderService } from '@/services/order-service';

export class OrdersController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { table_session_id, product_id, quantity } =
        createOrderSchema.parse(request.body);
      const order = await orderService.createOrder(
        table_session_id,
        product_id,
        quantity,
      );
      return response.status(201).json({
        message: 'Order created successfully',
        order,
      });
    } catch (error) {
      next(error);
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const { table_session_id } = queryOrdersParamsSchema.parse(request.params);
      const orders = await orderService.listOrdersBySession(table_session_id);
      return response.json({ orders });
    } catch (error) {
      next(error);
    }
  }

  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const { table_session_id } = queryOrdersParamsSchema.parse(request.params);
      const total = await orderService.getSessionTotal(table_session_id);
      return response.json(total);
    } catch (error) {
      next(error);
    }
  }
}
