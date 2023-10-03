import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {Password} from '@/modules/domain/index.server';
import {ValidationError} from '@/modules/errors.server';

const validationSchema = Schema.struct({
  oldPassword: Password.passwordSchema,
  newPassword: Password.passwordSchema,
});

export function validate(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(validationSchema)(value),
    catch: () => new ValidationError(),
  });
}

export type ChangePasswordProps = Schema.Schema.To<typeof validationSchema>;
