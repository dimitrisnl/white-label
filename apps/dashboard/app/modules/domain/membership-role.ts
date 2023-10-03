import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {ValidationError} from '../errors.server';

export const OWNER = 'OWNER' as const;
export const ADMIN = 'ADMIN' as const;
export const MEMBER = 'MEMBER' as const;

const MembershipRoleBrand = Symbol.for('MembershipRoleBrand');

export const membershipRoleSchema = Schema.literal(OWNER, ADMIN, MEMBER).pipe(
  Schema.brand(MembershipRoleBrand)
);

export type MembershipRole = Schema.Schema.To<typeof membershipRoleSchema>;

export function parse(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(membershipRoleSchema)(value),
    catch: () => new ValidationError(),
  });
}
