import zod from 'zod';

import {E} from '@/utils/fp';

export const validationSchema = zod
  .string({
    required_error: 'Email is required',
  })
  .email({
    message: 'Invalid email address',
  });

export type Email = zod.infer<typeof validationSchema>;

export function validate(data: Record<string, unknown>) {
  return validationSchema.safeParse(data);
}

export function parse(value: unknown): E.Either<Error, Email> {
  return E.tryCatch(() => validationSchema.parse(value), E.toError);
}
