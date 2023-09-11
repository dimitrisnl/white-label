import * as Effect from 'effect/Effect';
import zod from 'zod';

import {Org} from '@/modules/domain/index.server';
import {ValidationError} from '@/modules/errors.server';

const validationSchema = zod.object({
  name: Org.orgNameValidationSchema,
});

export function validate(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
    catch: () => new ValidationError(),
  });
}

export type EditOrgProps = zod.infer<typeof validationSchema>;
