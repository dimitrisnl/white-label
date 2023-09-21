import * as Effect from 'effect/Effect';
import zod from 'zod';

import {DbRecordParseError, ValidationError} from '../errors.server';
import * as DateString from './date';
import * as Email from './email';
import * as MembershipRole from './membership-role';
import * as Org from './org';
import * as User from './user';

export const validationSchema = zod
  .object({
    org: zod.object({
      name: Org.orgNameValidationSchema,
      id: Org.orgIdValidationSchema,
      slug: Org.orgSlugValidationSchema,
    }),
    user: zod.object({
      name: User.userNameValidationSchema,
      id: User.userIdValidationSchema,
      email: Email.validationSchema,
    }),
    role: MembershipRole.validationSchema,
    createdAt: DateString.validationSchema,
    updatedAt: DateString.validationSchema,
  })
  .brand('Membership');

export type Membership = zod.infer<typeof validationSchema>;

export function parse(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
    catch: () => new ValidationError(),
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
