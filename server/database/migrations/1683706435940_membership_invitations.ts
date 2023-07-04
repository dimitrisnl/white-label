/* eslint-disable @typescript-eslint/no-floating-promises, @typescript-eslint/require-await */

import BaseSchema from '@ioc:Adonis/Lucid/Schema';

import {InviteStatus} from '@/app/constants/InviteStatus';
import {Role} from '@/app/constants/Role';

export default class extends BaseSchema {
  protected tableName = 'membership_invitations';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().primary().unique();

      table.string('email').notNullable().unique();
      table.string('role').defaultTo(Role.MEMBER).notNullable();
      table
        .enum('status', [
          InviteStatus.ACCEPTED,
          InviteStatus.PENDING,
          InviteStatus.EXPIRED,
          InviteStatus.DECLINED,
        ])
        .defaultTo(InviteStatus.PENDING)
        .notNullable();

      table.string('org_id').notNullable();
      table.foreign('org_id').references('orgs.id').onDelete('CASCADE');

      table.unique(['email', 'org_id']);

      table.timestamp('created_at', {useTz: true});
      table.timestamp('updated_at', {useTz: true});
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
