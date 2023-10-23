import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

export const OWNER = 'OWNER' as const;
export const ADMIN = 'ADMIN' as const;
export const MEMBER = 'MEMBER' as const;

const MembershipRoleBrand = Symbol.for('MembershipRoleBrand');

export const membershipRoleSchema = Schema.literal(OWNER, ADMIN, MEMBER).pipe(
  Schema.message(() => "The role must be one of 'OWNER', 'ADMIN' or 'MEMBER'"),
  Schema.brand(MembershipRoleBrand)
);

export type MembershipRole = Schema.Schema.To<typeof membershipRoleSchema>;

export class ParseMembershipRoleError {
  readonly _tag = 'ParseMembershipRoleError';
}

export function parse(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(membershipRoleSchema)(value),
    catch: () => new ParseMembershipRoleError(),
  });
}
