import zod from 'zod';

import {E} from '@/utils/fp';

import * as DateString from './date';
import * as Uuid from './uuid';

export const orgNameValidationSchema = zod
  .string({
    required_error: 'Name is required',
  })
  .min(2, {
    message: 'Name must be at least 2 characters',
  });

export const orgIdValidationSchema = Uuid.validationSchema.brand('OrgId');

export const validationSchema = zod
  .object({
    id: orgIdValidationSchema,
    name: orgNameValidationSchema,
    createdAt: DateString.validationSchema,
    updatedAt: DateString.validationSchema,
  })
  .brand('Org');

export type Org = zod.infer<typeof validationSchema>;

export function validate(data: Record<string, unknown>) {
  return validationSchema.safeParse(data);
}

export function parse(value: unknown): E.Either<Error, Org> {
  return E.tryCatch(() => validationSchema.parse(value), E.toError);
}

export function parseId(value: unknown): E.Either<Error, Org['id']> {
  return E.tryCatch(() => orgIdValidationSchema.parse(value), E.toError);
}

export function dbRecordToDomain(entity: {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}) {
  return parse({
    id: entity.id,
    name: entity.name,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
  });
}
