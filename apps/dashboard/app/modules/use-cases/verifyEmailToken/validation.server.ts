import zod from 'zod';

import {Uuid} from '@/modules/domain/index.server';

const validationSchema = zod.object({
  token: Uuid.validationSchema,
});

export function validate(data: Record<string, unknown>) {
  return validationSchema.safeParse(data);
}
