/* eslint-disable @typescript-eslint/no-floating-promises, @typescript-eslint/require-await */

import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'password_reset_tokens';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().primary().unique();

      table.string('user_id').notNullable();
      table.foreign('user_id').references('users.id').onDelete('CASCADE');

      table.timestamp('expires_at', {useTz: true});
      table.timestamp('created_at', {useTz: true});
      table.timestamp('updated_at', {useTz: true});
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
