import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { knex } from '@/database/knex';
import { TableSessionRow } from '@/database/types/table-sessions-types';
import { AppError } from '@/utils/AppError';

export class TablesSessionsController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_id: z.coerce
          .number()
          .int()
          .positive('Table ID must be a positive integer'),
      });

      const { table_id } = bodySchema.parse(request.body);

      const session = await knex<TableSessionRow>('tables_sessions')
        .where({ table_id })
        .whereNull('closed_at')
        .first();

      if (session && !session.closed_at) {
        throw new AppError(
          'There is already an open session for this table',
          400,
        );
      }

      const [createdSession] = await knex<TableSessionRow>('tables_sessions')
        .insert({
          table_id,
          // opened_at: knex.fn.now(), não passamos porque a coluna no banco tem default para o timestamp atual
        })
        .returning('*');

      if (!createdSession) {
        throw new AppError('Table session not created', 400);
      }

      return response.status(201).json({
        message: 'Table session created successfully',
        session: createdSession,
      });
    } catch (error) {
      next(error);
    }
  }
}
