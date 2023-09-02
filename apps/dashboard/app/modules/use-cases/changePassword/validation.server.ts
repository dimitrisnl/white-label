import zod from 'zod';

import {Password} from '@/modules/domain/index.server';

const validationSchema = zod.object({
  oldPassword: Password.validationSchema,
  newPassword: Password.validationSchema,
});

export function validate(data: Record<string, unknown>) {
  return validationSchema.safeParse(data);
}
