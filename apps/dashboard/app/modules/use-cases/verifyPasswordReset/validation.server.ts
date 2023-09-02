import * as Effect from 'effect/Effect';
import zod from 'zod';

import {Uuid} from '@/modules/domain/index.server';
import {ValidationError} from '@/modules/errors.server';

const validationSchema = zod.object({
  token: Uuid.validationSchema,
});

export function validate(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
    catch: () => new ValidationError(),
  });
}

export type VerifyPasswordResetProps = zod.infer<typeof validationSchema>;
