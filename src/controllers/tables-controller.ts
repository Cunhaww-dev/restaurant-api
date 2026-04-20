import { Request, Response, NextFunction } from 'express';
import { tableService } from '@/services/table-service';

export class TablesController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const tables = await tableService.listTables();
      response.json(tables);
    } catch (error) {
      next(error);
    }
  }
}
