import * as Effect from 'effect/Effect';
import zod from 'zod';

import {Email, Password} from '@/modules/domain/index.server';
import {ValidationError} from '@/modules/errors.server';

const validationSchema = zod.object({
  email: Email.validationSchema,
  password: Password.validationSchema,
});

export function validate(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
    catch: () => new ValidationError(),
  });
}

export type VerifyUserCredentialsProps = zod.infer<typeof validationSchema>;
