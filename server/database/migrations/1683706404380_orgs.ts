/* eslint-disable @typescript-eslint/no-floating-promises, @typescript-eslint/require-await */

import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'orgs';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().primary();

      table.string('name').notNullable();
      table.string('slug').notNullable().unique();

      table.timestamp('created_at', {useTz: true});
      table.timestamp('updated_at', {useTz: true});
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
