import * as Effect from 'effect/Effect';
import zod from 'zod';

import {User} from '@/modules/domain/index.server';
import {ValidationError} from '@/modules/errors.server';

const validationSchema = zod.object({
  name: User.userNameValidationSchema,
});

export function validate(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
    catch: () => {
      return new ValidationError();
    },
  });
}

export type EditUserProps = zod.infer<typeof validationSchema>;
