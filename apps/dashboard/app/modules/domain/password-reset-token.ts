import * as Effect from 'effect/Effect';
import zod from 'zod';

import {ValidationError} from '../errors.server';
import * as DateString from './date';
import * as Uuid from './uuid';

const validationSchema = zod
  .object({
    id: Uuid.validationSchema,
    userId: Uuid.validationSchema,
    expiresAt: DateString.validationSchema,
    createdAt: DateString.validationSchema,
    updatedAt: DateString.validationSchema,
  })
  .brand('PasswordResetToken');

export type PasswordResetToken = zod.infer<typeof validationSchema>;

export function parse(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
    catch: () => new ValidationError(),
  });
}
