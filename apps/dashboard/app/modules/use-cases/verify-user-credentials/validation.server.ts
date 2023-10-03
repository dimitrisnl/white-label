import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {Email, Password} from '@/modules/domain/index.server';
import {ValidationError} from '@/modules/errors.server';

const validationSchema = Schema.struct({
  email: Email.emailSchema,
  password: Password.passwordSchema,
});

export function validate(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(validationSchema)(value),
    catch: () => new ValidationError(),
  });
}

export type VerifyUserCredentialsProps = Schema.Schema.To<
  typeof validationSchema
>;
