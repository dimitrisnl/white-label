import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {DbRecordParseError} from '../lib/errors.server.ts';
import * as DateString from './date.server.ts';
import * as Email from './email.server.ts';
import * as InviteStatus from './invite-status.server.ts';
import * as MembershipRole from './membership-role.server.ts';
import * as Org from './org.server.ts';
import * as Uuid from './uuid.server.ts';

const MembershipInvitationBrand = Symbol.for('MembershipInvitationBrand');

export const membershipInvitationSchema = Schema.struct({
  id: Uuid.uuidSchema,
  email: Email.emailSchema,
  status: InviteStatus.inviteStatusSchema,
  role: MembershipRole.membershipRoleSchema,
  createdAt: DateString.dateSchema,
  updatedAt: DateString.dateSchema,
  org: Schema.struct({
    name: Org.orgNameSchema,
    id: Org.orgIdSchema,
    slug: Org.orgSlugSchema,
  }),
}).pipe(Schema.brand(MembershipInvitationBrand));

export type MembershipInvitation = Schema.Schema.To<
  typeof membershipInvitationSchema
>;

export class ParseMembershipInvitationError {
  readonly _tag = 'ParseMembershipInvitationError';
}

export function parse(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(membershipInvitationSchema)(value),
    catch: () => new ParseMembershipInvitationError(),
  });
}

export function dbRecordToDomain(
  entity: {
    id: string;
    email: string;
    status: string;
    role: string;
    created_at: string;
    updated_at: string;
  },
  orgEntity: {id: string; name: string; slug: string}
) {
  return parse({
    id: entity.id,
    org: {
      id: orgEntity.id,
      name: orgEntity.name,
      slug: orgEntity.slug,
    },
    email: entity.email,
    status: entity.status,
    role: entity.role,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
  }).pipe(Effect.catchAll(() => Effect.fail(new DbRecordParseError())));
}
