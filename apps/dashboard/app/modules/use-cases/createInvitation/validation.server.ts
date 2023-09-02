import zod from 'zod';

import {Email, MembershipRole} from '@/modules/domain/index.server';

const validationSchema = zod.object({
  email: Email.validationSchema,
  role: MembershipRole.validationSchema,
});

export function validate(props: Record<string, unknown>) {
  return validationSchema.safeParse(props);
}
