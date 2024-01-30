import type {ParseError} from '@effect/schema/ParseResult';
import * as Schema from '@effect/schema/Schema';
import {Data, Effect} from 'effect';
import {compose} from 'effect/Function';

export const PENDING = 'PENDING' as const;
export const DECLINED = 'DECLINED' as const;
export const EXPIRED = 'EXPIRED' as const;

export const inviteStatusSchema = Schema.literal(
  PENDING,
  DECLINED,
  EXPIRED
).pipe(
  Schema.message(
    () => "Invitation status must be one of 'PENDING', 'DECLINED' or 'EXPIRED'"
  )
);

export type InviteStatus = Schema.Schema.To<typeof inviteStatusSchema>;

class InviteStatusParseError extends Data.TaggedError(
  'InviteStatusParseError'
)<{
  cause: ParseError;
}> {}

export const parseInviteStatus = compose(
  Schema.decodeUnknown(inviteStatusSchema),
  Effect.mapError((cause) => new InviteStatusParseError({cause}))
);
