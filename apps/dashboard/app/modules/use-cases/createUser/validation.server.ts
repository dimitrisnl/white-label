import zod from 'zod';

import {Email, Password, User} from '@/modules/domain/index.server';

const validationSchema = zod.object({
  password: Password.validationSchema,
  email: Email.validationSchema,
  name: User.userNameValidationSchema,
});

export function validate(data: Record<string, unknown>) {
  return validationSchema.safeParse(data);
}
