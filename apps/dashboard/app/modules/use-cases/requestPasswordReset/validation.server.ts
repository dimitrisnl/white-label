import zod from 'zod';

import {Email} from '@/modules/domain/index.server';

const validationSchema = zod.object({
  email: Email.validationSchema,
});

export function validate(props: Record<string, unknown>) {
  return validationSchema.safeParse(props);
}
