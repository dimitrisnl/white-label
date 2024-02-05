import type {AllBaseTables} from 'zapatos/schema';

import {db, testDbPool} from './dp-pool';

const allTables: AllBaseTables = [
  'announcements',
  'membership_invitations',
  'memberships',
  'orgs',
  'password_reset_tokens',
  'schema_migrations',
  'users',
  'verify_email_tokens',
];

const droppableTables = allTables.filter(
  (table) => table !== 'schema_migrations'
);

export async function truncate() {
  await db.truncate(droppableTables).run(testDbPool);
}
