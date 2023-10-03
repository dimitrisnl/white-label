import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {User} from '@/modules/domain/index.server';
import {ValidationError} from '@/modules/errors.server';

const validationSchema = Schema.struct({
  name: User.userNameSchema,
});

export function validate(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(validationSchema)(value),
    catch: () => new ValidationError(),
  });
}

export type EditUserProps = Schema.Schema.To<typeof validationSchema>;
