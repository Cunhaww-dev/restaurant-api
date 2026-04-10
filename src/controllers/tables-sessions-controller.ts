import { Request, Response, NextFunction } from 'express';

export class TablesSessionsController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      return response
        .status(201)
        .json({ message: 'Table session created successfully' });
    } catch (error) {
      next(error);
    }
  }
}
