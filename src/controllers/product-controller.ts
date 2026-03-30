import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

class ProductController {
  // Métodos do controller
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      return response.json({ message: 'Ok' });
    } catch (error) {
      next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(4, 'Name must be at least 4 characters'),
        price: z.number().gt(0, 'Price must be greater than 0'),
      });

      const { name, price } = bodySchema.parse(request.body); // parse lança um erro se a validação falhar

      return response.status(201).json({ name, price });
    } catch (error) {
      next(error);
    }
  }
}

export { ProductController };
