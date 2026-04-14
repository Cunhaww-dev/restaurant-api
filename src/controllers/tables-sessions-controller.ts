import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { knex } from '@/database/knex';
import { TableSessionRow } from '@/database/types/table-sessions-types';
import { AppError } from '@/utils/AppError';
import { createTableSessionSchema } from '@/schemas/tables-sessions/create-table-session.schema';
import { idParamSchema } from '@/schemas/common/params.schema';
import { queryTableSessionSchema } from '@/schemas/tables-sessions/query-table-session.schema';

export class TablesSessionsController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { table_id } = createTableSessionSchema.parse(request.body);

      const openSession = await knex<TableSessionRow>('tables_sessions')
        .where({ table_id })
        .whereNull('closed_at')
        .first();

      if (openSession) {
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

  // Listar sessões de mesas, com filtro opcional por status
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const { status, limit } = queryTableSessionSchema.parse(request.query);

      const query = knex<TableSessionRow>('tables_sessions');

      if (status === 'open') {
        const sessions = await query
          .whereNull('closed_at')
          .orderBy('opened_at', 'desc')
          .limit(limit);

        return response.json({ sessions });
      }

      if (status === 'closed') {
        const sessions = await query
          .whereNotNull('closed_at')
          .orderBy('closed_at', 'desc')
          .limit(limit);

        return response.json({ sessions });
      }

      const sessions = await query.orderBy('opened_at', 'desc').limit(limit);

      return response.json({ sessions });
    } catch (error) {
      next(error);
    }
  }

  // Encerrar sessão de uma mesa
  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(request.params);

      const session = await knex<TableSessionRow>('tables_sessions')
        .where({ id })
        .first();

      if (!session) {
        throw new AppError(`Table session with id ${id} not found`, 404);
      }

      if (session.closed_at) {
        throw new AppError(
          `Table session with id ${id} is already closed at ${session.closed_at}`,
          400,
        );
      }

      const [updatedSession] = await knex<TableSessionRow>('tables_sessions')
        .where({ id })
        .update({ closed_at: knex.fn.now() })
        .returning('*');

      return response.status(200).json({
        message: 'Table session closed successfully',
        session: updatedSession,
      });
    } catch (error) {
      next(error);
    }
  }
}
