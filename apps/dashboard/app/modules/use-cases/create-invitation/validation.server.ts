import * as Schema from '@effect/schema/Schema';

import {Email, MembershipRole} from '@/modules/domain/index.server';
import {schemaResolver} from '@/modules/validation-helper.server';

const validationSchema = Schema.struct({
  email: Email.emailSchema,
  role: MembershipRole.membershipRoleSchema,
});

export const validate = schemaResolver(validationSchema);

export type CreateInvitationProps = Schema.Schema.To<typeof validationSchema>;
