import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {Uuid} from '@/modules/domain/index.server';
import {ValidationError} from '@/modules/errors.server';

const validationSchema = Schema.struct({
  token: Uuid.uuidSchema,
});

export function validate(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(validationSchema)(value),
    catch: () => new ValidationError(),
  });
}

export type VerifyEmailProps = Schema.Schema.To<typeof validationSchema>;
