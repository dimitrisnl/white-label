import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {DbRecordParseError} from '../lib/errors.server.ts';
import * as DateString from './date.server.ts';
import * as Email from './email.server.ts';
import * as MembershipRole from './membership-role.server.ts';
import * as Org from './org.server.ts';
import * as User from './user.server.ts';

const MembershipBrand = Symbol.for('MembershipBrand');

export const membershipSchema = Schema.struct({
  org: Schema.struct({
    name: Org.orgNameSchema,
    id: Org.orgIdSchema,
    slug: Org.orgSlugSchema,
  }),
  user: Schema.struct({
    name: User.userNameSchema,
    id: User.userIdSchema,
    email: Email.emailSchema,
  }),
  role: MembershipRole.membershipRoleSchema,
  createdAt: DateString.dateSchema,
  updatedAt: DateString.dateSchema,
}).pipe(Schema.brand(MembershipBrand));

export type Membership = Schema.Schema.To<typeof membershipSchema>;

export class ParseMembershipError {
  readonly _tag = 'ParseMembershipError';
}

export function parse(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(membershipSchema)(value),
    catch: () => new ParseMembershipError(),
  });
}

export function dbRecordToDomain(
  entity: {role: string; created_at: string; updated_at: string},
  orgEntity: {id: string; name: string; slug: string},
  userEntity: {id: string; name: string; email: string}
) {
  return parse({
    role: entity.role,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
    org: {
      id: orgEntity.id,
      name: orgEntity.name,
      slug: orgEntity.slug,
    },
    user: {
      id: userEntity.id,
      name: userEntity.name,
      email: userEntity.email,
    },
  }).pipe(Effect.catchAll(() => Effect.fail(new DbRecordParseError())));
}
