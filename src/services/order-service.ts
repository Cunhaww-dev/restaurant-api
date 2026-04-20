import { knex } from '@/database/knex';
import { OrderInsert, OrderRow } from '@/database/types/order-types';
import { ProductRow } from '@/database/types/product-types';
import { TableSessionRow } from '@/database/types/table-sessions-types';
import { AppError } from '@/utils/AppError';

export class OrderService {
  async createOrder(
    table_session_id: number,
    product_id: number,
    quantity: number,
  ): Promise<OrderRow> {
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

    const orderToInsert: OrderInsert = {
      product_id,
      table_session_id,
      quantity,
      unit_price: product.price,
    };

    const [createdOrder] = await knex<OrderRow>('orders')
      .insert(orderToInsert)
      .returning('*');

    return createdOrder;
  }

  async listOrdersBySession(table_session_id: number) {
    return knex('orders')
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
  }

  async getSessionTotal(
    table_session_id: number,
  ): Promise<{ total_amount: number; total_items: number }> {
    const [result] = await knex('orders')
      .select(
        knex.raw(
          'COALESCE(SUM(orders.unit_price * orders.quantity), 0) AS total_amount',
        ),
        knex.raw('COALESCE(SUM(orders.quantity), 0) AS total_items'),
      )
      .where({ table_session_id });

    return result;
  }
}

export const orderService = new OrderService();
