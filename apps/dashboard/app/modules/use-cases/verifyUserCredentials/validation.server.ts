import zod from 'zod';

import {Email, Password} from '@/modules/domain/index.server';

const validationSchema = zod.object({
  email: Email.validationSchema,
  password: Password.validationSchema,
});

export function validate(props: Record<string, unknown>) {
  return validationSchema.safeParse(props);
}
