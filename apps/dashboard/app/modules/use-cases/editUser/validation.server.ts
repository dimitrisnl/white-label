import zod from 'zod';

import {User} from '@/modules/domain/index.server';

const validationSchema = zod.object({
  name: User.userNameValidationSchema,
});

export function validate(data: Record<string, unknown>) {
  return validationSchema.safeParse(data);
}
