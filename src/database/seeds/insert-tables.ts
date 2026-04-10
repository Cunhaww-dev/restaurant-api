import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('tables').del();

  await knex('tables').insert([
    { table_number: 1, capacity: 4 },
    { table_number: 2, capacity: 6 },
    { table_number: 3, capacity: 4 },
    { table_number: 4, capacity: 8 },
    { table_number: 5, capacity: 2 },
    { table_number: 6, capacity: 4 },
    { table_number: 7, capacity: 6 },
    { table_number: 8, capacity: 4 },
    { table_number: 9, capacity: 8 },
    { table_number: 10, capacity: 2 },
    { table_number: 11, capacity: 4 },
    { table_number: 12, capacity: 6 },
    { table_number: 13, capacity: 4 },
    { table_number: 14, capacity: 8 },
    { table_number: 15, capacity: 2 },
  ]);
}
