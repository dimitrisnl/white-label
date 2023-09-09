import * as Effect from 'effect/Effect';
import zod from 'zod';

import {Uuid} from '@/modules/domain/index.server';
import {ValidationError} from '@/modules/errors.server';

const validationSchema = zod.object({
  invitationId: Uuid.validationSchema,
});

export function validate(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
    catch: () => new ValidationError(),
  });
}

export type AcceptInvitationProps = zod.infer<typeof validationSchema>;
