import * as Schema from '@effect/schema/Schema';
import bcrypt from 'bcryptjs';
import * as Effect from 'effect/Effect';

import {PasswordHashError} from '../errors.server.ts';

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

export class ParsePasswordError {
  readonly _tag = 'ParsePasswordError';
}

export function parse(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(passwordSchema)(value),
    catch: () => new ParsePasswordError(),
  });
}

export function hash(password: string) {
  return Effect.tryPromise({
    try: () => bcrypt.hash(password, SALT_ROUNDS),
    catch: () => new PasswordHashError(),
  }).pipe(
    Effect.flatMap(parse),
    Effect.catchAll(() => Effect.fail(new PasswordHashError()))
  );
}

export function compare({
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
