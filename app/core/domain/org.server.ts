import * as Schema from '@effect/schema/Schema';
import baseSlugify from '@sindresorhus/slugify';
import * as Effect from 'effect/Effect';

import {DbRecordParseError} from '../lib/errors.server.ts';
import * as DateString from './date.server.ts';
import * as Uuid from './uuid.server.ts';

const OrgBrand = Symbol.for('OrgBrand');
const OrgIdBrand = Symbol.for('OrgIdBrand');

class ParseOrgError {
  readonly _tag = 'ParseOrgError';
}

class ParseOrgSlugError {
  readonly _tag = 'ParseOrgSlugError';
}

class ParseOrgIdError {
  readonly _tag = 'ParseOrgIdError';
}

export const orgNameSchema = Schema.string.pipe(
  Schema.trim,
  Schema.minLength(2, {
    message: () => 'Organization name must be at least 2 characters',
  }),
  Schema.maxLength(100, {
    message: () => 'Organization name cannot be more than 100 characters',
  })
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
    catch: () => new ParseOrgError(),
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
