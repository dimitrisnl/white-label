import * as Effect from 'effect/Effect';
import zod from 'zod';

import {ValidationError} from '../errors.server';

export const validationSchema = zod
  .string()
  .or(zod.date())
  .transform((arg) => new Date(arg));

export type DateString = zod.infer<typeof validationSchema>;

export function parse(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
    catch: () => new ValidationError(),
  });
}
