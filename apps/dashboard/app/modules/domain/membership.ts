import zod from 'zod';

import {E} from '@/utils/fp';

import * as DateString from './date';
import * as MembershipRole from './membership-role';
import * as Org from './org';

export const validationSchema = zod
  .object({
    org: Org.validationSchema,
    role: MembershipRole.validationSchema,
    createdAt: DateString.validationSchema,
    updatedAt: DateString.validationSchema,
  })
  .brand('Membership');

export type Membership = zod.infer<typeof validationSchema>;

export function validate(data: Record<string, unknown>) {
  return validationSchema.safeParse(data);
}

export function parse(value: unknown): E.Either<Error, Membership> {
  return E.tryCatch(() => validationSchema.parse(value), E.toError);
}

export function dbRecordToDomain(
  entity: {role: string; created_at: string; updated_at: string},
  orgEntity: {id: string; name: string; created_at: string; updated_at: string}
) {
  return parse({
    role: entity.role,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
    org: {
      id: orgEntity.id,
      name: orgEntity.name,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
    },
  });
}
