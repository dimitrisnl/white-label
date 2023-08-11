import bcrypt from 'bcrypt';
import zod from 'zod';

import {E} from '@/utils/fp';

export const validationSchema = zod
  .string({
    required_error: 'Password is required',
  })
  .min(8, {
    message: 'Password must be at least 8 characters',
  })
  .brand('Password');

export type Password = zod.infer<typeof validationSchema>;

export function validate(data: Record<string, unknown>) {
  return validationSchema.safeParse(data);
}

export function parse(value: unknown): E.Either<Error, Password> {
  return E.tryCatch(() => validationSchema.parse(value), E.toError);
}

const saltRounds = 10;

export async function hash(passsword: string) {
  const hash = await bcrypt.hash(passsword, saltRounds);
  return hash;
}

export async function compare({
  plainText,
  hashValue,
}: {
  plainText: string;
  hashValue: string;
}) {
  return bcrypt.compare(plainText, hashValue);
}
