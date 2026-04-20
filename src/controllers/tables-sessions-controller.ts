import { Request, Response, NextFunction } from 'express';
import { idParamSchema } from '@/schemas/common/params.schema';
import { createTableSessionSchema } from '@/schemas/tables-sessions/create-table-session.schema';
import { queryTableSessionSchema } from '@/schemas/tables-sessions/query-table-session.schema';
import { tableSessionService } from '@/services/table-session-service';

export class TablesSessionsController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { table_id } = createTableSessionSchema.parse(request.body);
      const session = await tableSessionService.createSession(table_id);
      return response.status(201).json({
        message: 'Table session created successfully',
        session,
      });
    } catch (error) {
      next(error);
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const { status, limit } = queryTableSessionSchema.parse(request.query);
      const sessions = await tableSessionService.listSessions(status, limit);
      return response.json({ sessions });
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(request.params);
      const session = await tableSessionService.closeSession(id);
      return response.status(200).json({
        message: 'Table session closed successfully',
        session,
      });
    } catch (error) {
      next(error);
    }
  }
}
