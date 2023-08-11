import zod from 'zod';

import {E} from '@/utils/fp';

export const validationSchema = zod
  .string()
  .or(zod.date())
  .transform((arg) => new Date(arg));

export type DateString = zod.infer<typeof validationSchema>;

export function validate(data: Record<string, unknown>) {
  return validationSchema.safeParse(data);
}

export function parse(value: unknown): E.Either<Error, DateString> {
  return E.tryCatch(() => validationSchema.parse(value), E.toError);
}
