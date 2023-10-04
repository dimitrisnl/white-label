import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

export const PENDING = 'PENDING' as const;
export const ACCEPTED = 'ACCEPTED' as const;
export const DECLINED = 'DECLINED' as const;
export const EXPIRED = 'EXPIRED' as const;

const InviteStatusBrand = Symbol.for('InviteStatusBrand');

export const inviteStatusSchema = Schema.literal(
  PENDING,
  ACCEPTED,
  DECLINED,
  EXPIRED
).pipe(
  Schema.message(
    () =>
      "Invitation status must be one of 'PENDING', 'ACCEPTED', 'DECLINED' or 'EXPIRED'"
  ),
  Schema.brand(InviteStatusBrand)
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
