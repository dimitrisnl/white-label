import baseSlugify from '@sindresorhus/slugify';
import * as Effect from 'effect/Effect';
import zod from 'zod';

import {
  DbRecordParseError,
  ParseOrgIdError,
  ParseOrgSlugError,
  ValidationError,
} from '../errors.server';
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

export const orgSlugValidationSchema = zod.string().min(2);

export const validationSchema = zod
  .object({
    id: orgIdValidationSchema,
    name: orgNameValidationSchema,
    createdAt: DateString.validationSchema,
    updatedAt: DateString.validationSchema,
    slug: orgSlugValidationSchema,
  })
  .brand('Org');

export type Org = zod.infer<typeof validationSchema>;

export function parse(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
    catch: () => new ValidationError(),
  });
}

export function parseId(value: unknown) {
  return Effect.try({
    try: () => orgIdValidationSchema.parse(value),
    catch: () => new ParseOrgIdError(),
  });
}

export function parseSlug(value: unknown) {
  return Effect.try({
    try: () => orgSlugValidationSchema.parse(value),
    catch: () => new ParseOrgSlugError(),
  });
}

export function dbRecordToDomain(entity: {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  slug: string;
}) {
  return parse({
    id: entity.id,
    name: entity.name,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
    slug: entity.slug,
  }).pipe(Effect.catchAll(() => Effect.fail(new DbRecordParseError())));
}

export function slugify(text: string) {
  return Effect.sync(() => baseSlugify(text));
}
