import * as Effect from 'effect/Effect';
import zod from 'zod';

import {Email, Password, User} from '@/modules/domain/index.server';
import {ValidationError} from '@/modules/errors.server';

const validationSchema = zod.object({
  password: Password.validationSchema,
  email: Email.validationSchema,
  name: User.userNameValidationSchema,
});

export function validate(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
    catch: () => new ValidationError(),
  });
}

export type CreateUserProps = zod.infer<typeof validationSchema>;
