import type {ParseError} from '@effect/schema/ParseResult';
import * as Schema from '@effect/schema/Schema';
import {Data, Effect} from 'effect';
import {compose} from 'effect/Function';

import {uuidSchema} from './uuid.server';

const PasswordResetTokenBrand = Symbol.for('PasswordResetTokenBrand');

export const passwordResetTokenSchema = Schema.struct({
  id: uuidSchema.pipe(Schema.message(() => 'Token is in invalid format')),
  userId: uuidSchema,
  expiresAt: Schema.Date,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
}).pipe(Schema.brand(PasswordResetTokenBrand));

export type PasswordResetToken = Schema.Schema.To<
  typeof passwordResetTokenSchema
>;

class PasswordResetTokenParseError extends Data.TaggedError(
  'PasswordResetTokenParseError'
)<{
  cause: ParseError;
}> {}

export const parsePasswordResetToken = compose(
  Schema.decodeUnknown(passwordResetTokenSchema),
  Effect.mapError((cause) => new PasswordResetTokenParseError({cause}))
);
