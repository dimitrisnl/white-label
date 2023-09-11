import * as Effect from 'effect/Effect';
import zod from 'zod';

import {Password} from '@/modules/domain/index.server';
import {ValidationError} from '@/modules/errors.server';

const validationSchema = zod.object({
  oldPassword: Password.validationSchema,
  newPassword: Password.validationSchema,
});

export function validate(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
    catch: () => new ValidationError(),
  });
}

export type ChangePasswordProps = zod.infer<typeof validationSchema>;
