import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import * as DateString from './date';
import * as Uuid from './uuid';

const VerifyEmailTokenBrand = Symbol.for('VerifyEmailTokenBrand');

export const verifyEmailTokenSchema = Schema.struct({
  id: Uuid.uuidSchema.pipe(Schema.message(() => 'Token is in invalid format')),
  userId: Uuid.uuidSchema,
  expiresAt: DateString.dateSchema,
  createdAt: DateString.dateSchema,
  updatedAt: DateString.dateSchema,
}).pipe(Schema.brand(VerifyEmailTokenBrand));

export type VerifyEmailToken = Schema.Schema.To<typeof verifyEmailTokenSchema>;

export class ParseVerifyTokenError {
  readonly _tag = 'ParseVerifyTokenError';
}

export function parse(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(verifyEmailTokenSchema)(value),
    catch: () => new ParseVerifyTokenError(),
  });
}
