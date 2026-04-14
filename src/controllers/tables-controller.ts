import { Request, Response, NextFunction } from 'express';
import { knex } from '@/database/knex';
import { TableRow } from '@/database/types/table-types';

export class TablesController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const tables = await knex<TableRow>('tables')
        .select()
        .from('tables')
        .orderBy('table_number', 'asc');

      response.json(tables);
    } catch (error) {
      next(error);
    }
  }
}
