import * as Schema from '@effect/schema/Schema';
import baseSlugify from '@sindresorhus/slugify';
import * as Effect from 'effect/Effect';

import {
  DbRecordParseError,
  ParseOrgIdError,
  ParseOrgSlugError,
  ValidationError,
} from '../errors.server';
import * as DateString from './date';
import * as Uuid from './uuid';

const OrgBrand = Symbol.for('OrgBrand');
const OrgIdBrand = Symbol.for('OrgIdBrand');

export const orgNameSchema = Schema.string.pipe(
  Schema.trim,
  Schema.minLength(2),
  Schema.maxLength(120)
);

export const orgIdSchema = Uuid.uuidSchema.pipe(Schema.brand(OrgIdBrand));
export const orgSlugSchema = Schema.string.pipe(Schema.minLength(2));

export const orgSchema = Schema.struct({
  id: orgIdSchema,
  name: orgNameSchema,
  slug: orgSlugSchema,
  createdAt: DateString.dateSchema,
  updatedAt: DateString.dateSchema,
}).pipe(Schema.brand(OrgBrand));

export type Org = Schema.Schema.To<typeof orgSchema>;

export function parse(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(orgSchema)(value),
    catch: () => new ValidationError(),
  });
}

export function parseId(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(orgIdSchema)(value),
    catch: () => new ParseOrgIdError(),
  });
}

export function parseSlug(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(orgSlugSchema)(value),
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
