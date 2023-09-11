import * as Effect from 'effect/Effect';
import zod from 'zod';

import {Email} from '@/modules/domain/index.server';
import {ValidationError} from '@/modules/errors.server';

const validationSchema = zod.object({
  email: Email.validationSchema,
});

export function validate(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
    catch: () => new ValidationError(),
  });
}

export type RequestPasswordResetProps = zod.infer<typeof validationSchema>;
