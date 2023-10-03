import * as Schema from '@effect/schema/Schema';
import bcrypt from 'bcrypt';
import * as Effect from 'effect/Effect';

import {PasswordHashError, ValidationError} from '../errors.server';

const SALT_ROUNDS = 10;

const PasswordBrand = Symbol.for('PasswordBrand');

export const passwordSchema = Schema.string.pipe(
  Schema.minLength(8),
  Schema.maxLength(100),
  Schema.brand(PasswordBrand)
);

export type Password = Schema.Schema.To<typeof passwordSchema>;

export function parse(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(passwordSchema)(value),
    catch: () => new ValidationError(),
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
