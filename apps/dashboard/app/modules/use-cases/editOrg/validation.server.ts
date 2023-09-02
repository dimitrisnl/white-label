import zod from 'zod';

import {Org} from '@/modules/domain/index.server';

const validationSchema = zod.object({
  name: Org.orgNameValidationSchema,
});

export function validate(data: Record<string, unknown>) {
  return validationSchema.safeParse(data);
}
