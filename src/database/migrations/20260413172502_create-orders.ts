import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('orders', (table) => {
    table.increments('id').primary();
    table.integer('table_session_id').unsigned().notNullable();
    table.integer('product_id').unsigned().notNullable();
    table.integer('quantity').unsigned().notNullable().defaultTo(1);
    // Price aqui serve para manter a consistencia do valor mesmo que o preço do produto mude posteriormente
    table.decimal('unit_price', 10, 2).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table
      .foreign('table_session_id')
      .references('id')
      .inTable('tables_sessions');

    table.foreign('product_id').references('id').inTable('products');

    table.check('?? > 0', ['quantity']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('orders');
}
