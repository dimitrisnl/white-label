import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {ValidationError} from '../errors.server';

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
).pipe(Schema.brand(InviteStatusBrand));

export type InviteStatus = Schema.Schema.To<typeof inviteStatusSchema>;

export function parse(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(inviteStatusSchema)(value),
    catch: () => new ValidationError(),
  });
}
