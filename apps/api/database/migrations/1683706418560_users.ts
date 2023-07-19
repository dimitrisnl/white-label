/* eslint-disable @typescript-eslint/no-floating-promises, @typescript-eslint/require-await */

import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'users';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().primary();

      table.string('email', 255).notNullable().unique();
      table.string('password', 180).notNullable();
      table.string('name', 255).notNullable();
      table.boolean('email_verified').notNullable().defaultTo(false);

      table.timestamp('created_at', {useTz: true});
      table.timestamp('updated_at', {useTz: true});
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
