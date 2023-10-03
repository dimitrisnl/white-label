import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {Email, Password, User} from '@/modules/domain/index.server';
import {ValidationError} from '@/modules/errors.server';

const validationSchema = Schema.struct({
  password: Password.passwordSchema,
  email: Email.emailSchema,
  name: User.userNameSchema,
});

export function validate(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(validationSchema)(value),
    catch: () => new ValidationError(),
  });
}

export type CreateUserProps = Schema.Schema.To<typeof validationSchema>;
