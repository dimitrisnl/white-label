import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {Org} from '@/modules/domain/index.server';
import {ValidationError} from '@/modules/errors.server';

const validationSchema = Schema.struct({
  name: Org.orgNameSchema,
});

export function validate(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(validationSchema)(value),
    catch: () => new ValidationError(),
  });
}

export type EditOrgProps = Schema.Schema.To<typeof validationSchema>;
