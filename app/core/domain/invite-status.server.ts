import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

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

export class ParseInviteStatusError {
  readonly _tag = 'ParseInviteStatusError';
}

export function parse(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(inviteStatusSchema)(value),
    catch: () => new ParseInviteStatusError(),
  });
}
