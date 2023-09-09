import * as Effect from 'effect/Effect';
import zod from 'zod';

import {Email, MembershipRole} from '@/modules/domain/index.server';
import {ValidationError} from '@/modules/errors.server';

const validationSchema = zod.object({
  email: Email.validationSchema,
  role: MembershipRole.validationSchema,
});

export function validate(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
    catch: () => new ValidationError(),
  });
}

export type CreateInvitationProps = zod.infer<typeof validationSchema>;