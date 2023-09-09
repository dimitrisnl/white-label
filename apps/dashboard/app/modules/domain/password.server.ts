import bcrypt from 'bcrypt';
import * as Effect from 'effect/Effect';
import zod from 'zod';

import {PasswordHashError, ValidationError} from '../errors.server';

const SALT_ROUNDS = 10;

export const validationSchema = zod
  .string({
    required_error: 'Password is required',
  })
  .min(8, {
    message: 'Password must be at least 8 characters',
  })
  .brand('Password');

export type Password = zod.infer<typeof validationSchema>;

export function parse(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
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
