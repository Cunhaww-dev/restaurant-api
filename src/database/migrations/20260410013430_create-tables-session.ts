import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tables_sessions', (table) => {
    table.increments('id').primary();
    table.integer('table_id').notNullable();
    table.timestamp('opened_at').defaultTo(knex.fn.now());
    table.timestamp('closed_at');

    // foreign key para garantir que a sessão esteja associada a uma mesa existente
    table
      .foreign('table_id')
      .references('id')
      .inTable('tables')
      .onDelete('CASCADE');
  });

  // Garante que cada mesa tenha apenas uma sessão aberta por vez.
  await knex.raw(`
   CREATE UNIQUE INDEX unique_open_table_session 
   ON tables_sessions (table_id) 
   WHERE closed_at IS NULL;`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tables_sessions');
}
