import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import * as DateString from './date';
import * as Uuid from './uuid';

const PasswordResetTokenBrand = Symbol.for('PasswordResetTokenBrand');

export const passwordResetTokenSchema = Schema.struct({
  id: Uuid.uuidSchema.pipe(Schema.message(() => 'Token is in invalid format')),
  userId: Uuid.uuidSchema,
  expiresAt: DateString.dateSchema,
  createdAt: DateString.dateSchema,
  updatedAt: DateString.dateSchema,
}).pipe(Schema.brand(PasswordResetTokenBrand));

export type MembershipInvitation = Schema.Schema.To<
  typeof passwordResetTokenSchema
>;

export class ParsePasswordResetTokenError {
  readonly _tag = 'ParsePasswordResetTokenError';
}

export function parse(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(passwordResetTokenSchema)(value),
    catch: () => new ParsePasswordResetTokenError(),
  });
}
