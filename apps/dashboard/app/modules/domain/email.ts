import * as Effect from 'effect/Effect';
import zod from 'zod';

import {ValidationError} from '../errors.server';

export const validationSchema = zod
  .string({
    required_error: 'Email is required',
  })
  .email({
    message: 'Invalid email address',
  });

export type Email = zod.infer<typeof validationSchema>;

export function parse(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
    catch: () => new ValidationError(),
  });
}
