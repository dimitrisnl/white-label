import zod from 'zod';

import {Password, Uuid} from '@/modules/domain/index.server';

const validationSchema = zod.object({
  password: Password.validationSchema,
  token: Uuid.validationSchema,
});

export function validate(props: Record<string, unknown>) {
  return validationSchema.safeParse(props);
}
