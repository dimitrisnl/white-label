import * as Effect from 'effect/Effect';
import zod from 'zod';

import {Password, Uuid} from '@/modules/domain/index.server';
import {ValidationError} from '@/modules/errors.server';

const validationSchema = zod.object({
  password: Password.validationSchema,
  token: Uuid.validationSchema,
});

export function validate(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
    catch: () => new ValidationError(),
  });
}

export type ResetPasswordProps = zod.infer<typeof validationSchema>;
