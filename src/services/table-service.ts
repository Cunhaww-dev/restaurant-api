import { knex } from '@/database/knex';
import { TableRow } from '@/database/types/table-types';

export class TableService {
  async listTables(): Promise<TableRow[]> {
    return knex<TableRow>('tables')
      .select()
      .from('tables')
      .orderBy('table_number', 'asc');
  }
}

export const tableService = new TableService();
