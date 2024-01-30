import type {ParseError} from '@effect/schema/ParseResult';
import * as Schema from '@effect/schema/Schema';
import {Data, Effect} from 'effect';
import {compose} from 'effect/Function';

export const OWNER = 'OWNER' as const;
export const ADMIN = 'ADMIN' as const;
export const MEMBER = 'MEMBER' as const;

const MembershipRoleBrand = Symbol.for('MembershipRoleBrand');

export const membershipRoleSchema = Schema.literal(OWNER, ADMIN, MEMBER).pipe(
  Schema.message(() => "The role must be one of 'OWNER', 'ADMIN' or 'MEMBER'"),
  Schema.brand(MembershipRoleBrand)
);

export type MembershipRole = Schema.Schema.To<typeof membershipRoleSchema>;

class MembershipRoleParseError extends Data.TaggedError(
  'MembershipRoleParseError'
)<{
  cause: ParseError;
}> {}

export const parseMembershipRole = compose(
  Schema.decodeUnknown(membershipRoleSchema),
  Effect.mapError((cause) => new MembershipRoleParseError({cause}))
);
