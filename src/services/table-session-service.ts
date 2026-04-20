import { knex } from '@/database/knex';
import { TableSessionRow } from '@/database/types/table-sessions-types';
import { AppError } from '@/utils/AppError';

export class TableSessionService {
  async createSession(table_id: number): Promise<TableSessionRow> {
    const openSession = await knex<TableSessionRow>('tables_sessions')
      .where({ table_id })
      .whereNull('closed_at')
      .first();

    if (openSession) {
      throw new AppError('There is already an open session for this table', 400);
    }

    const [createdSession] = await knex<TableSessionRow>('tables_sessions')
      .insert({ table_id })
      .returning('*');

    if (!createdSession) {
      throw new AppError('Table session not created', 400);
    }

    return createdSession;
  }

  async listSessions(
    status: 'open' | 'closed' | undefined,
    limit: number,
  ): Promise<TableSessionRow[]> {
    const query = knex<TableSessionRow>('tables_sessions');

    if (status === 'open') {
      return query.whereNull('closed_at').orderBy('opened_at', 'desc').limit(limit);
    }

    if (status === 'closed') {
      return query.whereNotNull('closed_at').orderBy('closed_at', 'desc').limit(limit);
    }

    return query.orderBy('opened_at', 'desc').limit(limit);
  }

  async closeSession(id: number): Promise<TableSessionRow> {
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

    return updatedSession;
  }
}

export const tableSessionService = new TableSessionService();
