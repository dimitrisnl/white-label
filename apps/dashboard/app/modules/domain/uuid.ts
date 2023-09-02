import {v4 as uuidv4} from 'uuid';
import zod from 'zod';

import {E} from '@/utils/fp';

export const validationSchema = zod
  .string({
    required_error: 'Id is required',
  })
  .uuid({
    message: 'Invalid id',
  })
  .brand('Uuid');

export type Uuid = zod.infer<typeof validationSchema>;

export function validate(data: Record<string, unknown>) {
  return validationSchema.safeParse(data);
}

export function parse(value: unknown): E.Either<Error, Uuid> {
  return E.tryCatch(() => validationSchema.parse(value), E.toError);
}

// todo: IO
export function generate() {
  const uuid = uuidv4();
  return uuid;
}
