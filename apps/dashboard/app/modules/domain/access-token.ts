import zod from 'zod';

import {E} from '@/utils/fp';

import * as DateString from './date';

export const tokenIdValidationSchema = zod
  .string({
    required_error: 'Token ID is required',
  })
  .uuid({
    message: 'Invalid token ID',
  });

const validationSchema = zod
  .object({
    token: tokenIdValidationSchema,
    type: zod.string(),
    expiresAt: DateString.validationSchema,
  })
  .brand('AccessToken');

export type AccessToken = zod.infer<typeof validationSchema>;

export function validate(data: Record<string, unknown>) {
  return validationSchema.safeParse(data);
}

export function parse(value: unknown): E.Either<Error, AccessToken> {
  return E.tryCatch(() => validationSchema.parse(value), E.toError);
}
