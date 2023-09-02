import zod from 'zod';

import {E} from '@/utils/fp';

import * as DateString from './date';
import * as Email from './email';
import * as Uuid from './uuid';

export const userNameValidationSchema = zod
  .string({
    required_error: 'Name is required',
  })
  .min(2, {
    message: 'Name must be at least 2 characters',
  });

export const userIdValidationSchema = Uuid.validationSchema.brand('UserId');

export const validationSchema = zod
  .object({
    id: Uuid.validationSchema.brand('UserId'),
    name: userNameValidationSchema,
    email: Email.validationSchema,
    emailVerified: zod.boolean({
      required_error: 'Email verified is required',
    }),
    createdAt: DateString.validationSchema,
    updatedAt: DateString.validationSchema,
  })
  .brand('User');

export type User = zod.infer<typeof validationSchema>;

export function validate(data: Record<string, unknown>) {
  return validationSchema.safeParse(data);
}

export function parse(value: unknown): E.Either<Error, User> {
  return E.tryCatch(() => validationSchema.parse(value), E.toError);
}

export function parseId(value: unknown): E.Either<Error, User['id']> {
  return E.tryCatch(() => userIdValidationSchema.parse(value), E.toError);
}

export function dbRecordToDomain(entity: {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}) {
  return parse({
    id: entity.id,
    name: entity.name,
    email: entity.email,
    emailVerified: entity.email_verified,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
  });
}
