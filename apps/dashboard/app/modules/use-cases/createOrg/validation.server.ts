import zod from 'zod';

import {Org} from '@/modules/domain/index.server';

const validationSchema = zod.object({
  name: Org.orgNameValidationSchema,
});

export function validate(props: Record<string, unknown>) {
  return validationSchema.safeParse(props);
}
