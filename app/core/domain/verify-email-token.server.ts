import type {ParseError} from '@effect/schema/ParseResult';
import * as Schema from '@effect/schema/Schema';
import {Data, Effect} from 'effect';
import {compose} from 'effect/Function';

import {uuidSchema} from './uuid.server';

const VerifyEmailTokenBrand = Symbol.for('VerifyEmailTokenBrand');

export const verifyEmailTokenSchema = Schema.Struct({
  id: uuidSchema.pipe(Schema.message(() => 'Token is in invalid format')),
  userId: uuidSchema,
  expiresAt: Schema.Date,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
}).pipe(Schema.brand(VerifyEmailTokenBrand));

export type VerifyEmailToken = Schema.Schema.Type<
  typeof verifyEmailTokenSchema
>;

class VerifyEmailTokenParseError extends Data.TaggedError(
  'VerifyEmailTokenParseError'
)<{
  cause: ParseError;
}> {}

export const parseVerifyEmailToken = compose(
  Schema.decodeUnknown(verifyEmailTokenSchema),
  Effect.mapError((cause) => new VerifyEmailTokenParseError({cause}))
);
