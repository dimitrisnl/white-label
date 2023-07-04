/* eslint-disable @typescript-eslint/no-floating-promises, @typescript-eslint/require-await */

import BaseSchema from '@ioc:Adonis/Lucid/Schema';

import {Role} from '@/app/constants/Role';

export default class extends BaseSchema {
  protected tableName = 'memberships';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.string('org_id').notNullable();
      table.foreign('org_id').references('orgs.id').onDelete('CASCADE');

      table.string('user_id').notNullable();
      table.foreign('user_id').references('users.id').onDelete('CASCADE');

      table
        .enum('role', [Role.OWNER, Role.ADMIN, Role.MEMBER])
        .defaultTo(Role.MEMBER)
        .notNullable();

      table.timestamp('created_at', {useTz: true});
      table.timestamp('updated_at', {useTz: true});
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
