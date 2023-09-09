import * as Effect from 'effect/Effect';
import zod from 'zod';

import {DbRecordParseError, ValidationError} from '../errors.server';
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

export function parse(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
    catch: () => new ValidationError(),
  });
}

export function parseId(value: unknown) {
  return Effect.try({
    try: () => userIdValidationSchema.parse(value),
    catch: () => new ValidationError(),
  });
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
  }).pipe(Effect.catchAll(() => Effect.fail(new DbRecordParseError())));
}
