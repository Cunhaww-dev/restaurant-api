import { Request, Response, NextFunction } from 'express';
import { table } from 'node:console';
import { z } from 'zod';

export class OrdersController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_session_id: z.number().int().positive(),
        product_id: z.number().int().positive(),
        quantity: z.number().int().positive().default(1),
        //   unit_price: z.number().positive(),
      });

      const { table_session_id, product_id, quantity } = bodySchema.parse(
        request.body,
      );

      return response.status(200).json();
    } catch (error) {
      next(error);
    }
  }
}
