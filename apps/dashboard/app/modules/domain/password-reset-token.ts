import zod from 'zod';

import {E} from '@/utils/fp';

import * as DateString from './date';
import * as Uuid from './uuid';

const validationSchema = zod
  .object({
    id: Uuid.validationSchema,
    userId: Uuid.validationSchema,
    expiresAt: DateString.validationSchema,
    createdAt: DateString.validationSchema,
    updatedAt: DateString.validationSchema,
  })
  .brand('PasswordResetToken');

export type PasswordResetToken = zod.infer<typeof validationSchema>;

export function validate(data: Record<string, unknown>) {
  return validationSchema.safeParse(data);
}

export function parse(value: unknown): E.Either<Error, PasswordResetToken> {
  return E.tryCatch(() => validationSchema.parse(value), E.toError);
}
