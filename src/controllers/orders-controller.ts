import { knex } from '@/database/knex';
import { OrderRow } from '@/database/types/order-types';
import { ProductRow } from '@/database/types/product-types';
import { TableSessionRow } from '@/database/types/table-sessions-types';
import { AppError } from '@/utils/AppError';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export class OrdersController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_session_id: z.coerce.number().int().positive(),
        product_id: z.coerce.number().int().positive(),
        quantity: z.coerce.number().int().positive().default(1),
        //   unit_price: z.number().positive(),
      });

      const { table_session_id, product_id, quantity } = bodySchema.parse(
        request.body,
      );

      const session = await knex<TableSessionRow>('tables_sessions')
        .where({ id: table_session_id })
        .first();

      if (!session) {
        throw new AppError(
          `Table session with id ${table_session_id} not found`,
          404,
        );
      }

      if (session.closed_at) {
        throw new AppError(
          `Table session with id ${table_session_id} is already closed`,
          400,
        );
      }

      const product = await knex<ProductRow>('products')
        .where({ id: product_id })
        .first();

      if (!product) {
        throw new AppError(`Product with id ${product_id} not found`, 404);
      }

      const [createdOrder] = await knex<OrderRow>('orders')
        .insert({
          product_id,
          table_session_id,
          quantity,
          unit_price: product.price,
        })
        .returning('*');

      return response.status(201).json({
        message: 'Order created successfully',
        order: createdOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  // metodo para listar os pedidos de uma sessão de mesa
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const { table_session_id } = request.params;

      const orders = await knex('orders')
        .select(
          'orders.id',
          'orders.table_session_id',
          'orders.product_id',
          'products.name',
          'orders.unit_price',
          'orders.quantity',
          knex.raw('(orders.unit_price * orders.quantity) AS total_price'),
          'orders.created_at',
          'orders.updated_at',
        )
        .join('products', 'orders.product_id', 'products.id')
        .where({ table_session_id })
        .orderBy('orders.created_at', 'desc');
      return response.json({
        orders,
      });
    } catch (error) {
      next(error);
    }
  }

  // Reusmo da conta/valor total do pedido.
  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const { table_session_id } = request.params;

      const [order] = await knex('orders')
        .select(
          knex.raw(
            'COALESCE(SUM(orders.unit_price * orders.quantity), 0) AS total_amount',
          ),
          knex.raw('COALESCE(SUM(orders.quantity), 0) AS total_items'),
        )
        .where({ table_session_id });

      return response.json(order);
    } catch (error) {
      next(error);
    }
  }
}
