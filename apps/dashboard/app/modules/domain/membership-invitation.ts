import * as Effect from 'effect/Effect';
import zod from 'zod';

import {DbRecordParseError, ValidationError} from '../errors.server';
import * as DateString from './date';
import * as Email from './email';
import * as InviteStatus from './invite-status';
import * as MembershipRole from './membership-role';
import * as Uuid from './uuid';

export const validationSchema = zod
  .object({
    id: Uuid.validationSchema,
    orgId: Uuid.validationSchema,
    email: Email.validationSchema,
    status: InviteStatus.validationSchema,
    role: MembershipRole.validationSchema,
    createdAt: DateString.validationSchema,
    updatedAt: DateString.validationSchema,
  })
  .brand('MembershipInvitation');

export type MembershipInvitation = zod.infer<typeof validationSchema>;

export function parse(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
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
