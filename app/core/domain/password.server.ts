import type {ParseError} from '@effect/schema/ParseResult';
import * as Schema from '@effect/schema/Schema';
import bcrypt from 'bcryptjs';
import {Data, Effect} from 'effect';
import {compose, pipe} from 'effect/Function';

const SALT_ROUNDS = 10;
const PasswordBrand = Symbol.for('PasswordBrand');

export const passwordSchema = Schema.string.pipe(
  Schema.minLength(8, {
    message: () => 'Password should be at least 8 characters long',
  }),
  Schema.maxLength(100, {
    message: () => 'Password should be at most 100 characters long',
  }),
  Schema.brand(PasswordBrand)
);

export type Password = Schema.Schema.To<typeof passwordSchema>;

export class PasswordHashError {
  readonly _tag = 'PasswordHashError';
}
class PasswordParseError extends Data.TaggedError('PasswordParseError')<{
  cause: ParseError;
}> {}

export const parsePassword = compose(
  Schema.decodeUnknown(passwordSchema),
  Effect.mapError((cause) => new PasswordParseError({cause}))
);

export function hashPassword(password: Password) {
  return pipe(
    Effect.tryPromise(() => bcrypt.hash(password, SALT_ROUNDS)),
    Effect.mapError(() => new PasswordHashError())
  );
}

export function comparePasswords({
  plainText,
  hashValue,
}: {
  plainText: string;
  hashValue: string;
}) {
  return Effect.tryPromise({
    try: () => bcrypt.compare(plainText, hashValue),
    catch: () => new PasswordHashError(),
  });
}
