import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {Email, MembershipRole} from '@/modules/domain/index.server';
import {ValidationError} from '@/modules/errors.server';

const validationSchema = Schema.struct({
  email: Email.emailSchema,
  role: MembershipRole.membershipRoleSchema,
});

export function validate(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(validationSchema)(value),
    catch: () => new ValidationError(),
  });
}

export type CreateInvitationProps = Schema.Schema.To<typeof validationSchema>;
