import * as Schema from '@effect/schema/Schema';

import * as Email from '~/core/domain/email.server';
import * as MembershipRole from '~/core/domain/membership-role.server';
import {schemaResolver} from '~/core/lib/validation-helper.server';

const validationSchema = Schema.struct({
  email: Email.emailSchema,
  role: MembershipRole.membershipRoleSchema,
});

export const validate = schemaResolver(validationSchema);

export type CreateInvitationProps = Schema.Schema.To<typeof validationSchema>;
