import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {Password, Uuid} from '@/modules/domain/index.server';
import {ValidationError} from '@/modules/errors.server';

const validationSchema = Schema.struct({
  password: Password.passwordSchema,
  token: Uuid.uuidSchema,
});

export function validate(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(validationSchema)(value),
    catch: () => new ValidationError(),
  });
}

export type ResetPasswordProps = Schema.Schema.To<typeof validationSchema>;
