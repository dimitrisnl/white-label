import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {DbRecordParseError, ValidationError} from '../errors.server';
import * as DateString from './date';
import * as Email from './email';
import * as InviteStatus from './invite-status';
import * as MembershipRole from './membership-role';
import * as Uuid from './uuid';

const MembershipInvitationBrand = Symbol.for('MembershipInvitationBrand');

export const membershipInvitationSchema = Schema.struct({
  id: Uuid.uuidSchema,
  orgId: Uuid.uuidSchema,
  email: Email.emailSchema,
  status: InviteStatus.inviteStatusSchema,
  role: MembershipRole.membershipRoleSchema,
  createdAt: DateString.dateSchema,
  updatedAt: DateString.dateSchema,
}).pipe(Schema.brand(MembershipInvitationBrand));

export type MembershipInvitation = Schema.Schema.To<
  typeof membershipInvitationSchema
>;

export function parse(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(membershipInvitationSchema)(value),
    catch: () => new ValidationError(),
  });
}

export function dbRecordToDomain(entity: {
  id: string;
  org_id: string;
  email: string;
  status: string;
  role: string;
  created_at: string;
  updated_at: string;
}) {
  return parse({
    id: entity.id,
    orgId: entity.org_id,
    email: entity.email,
    status: entity.status,
    role: entity.role,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
  }).pipe(Effect.catchAll(() => Effect.fail(new DbRecordParseError())));
}
