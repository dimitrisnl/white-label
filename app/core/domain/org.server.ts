import type {ParseError} from '@effect/schema/ParseResult';
import * as Schema from '@effect/schema/Schema';
import baseSlugify from '@sindresorhus/slugify';
import {Data, Effect} from 'effect';
import {compose} from 'effect/Function';
import type {orgs} from 'zapatos/schema';

import {db} from '../db/schema.server.ts';
import {uuidSchema} from './uuid.server.ts';

const OrgIdBrand = Symbol.for('OrgIdBrand');

class OrgIdParseError extends Data.TaggedError('OrgIdParseError')<{
  cause: ParseError;
}> {}

class OrgParseError extends Data.TaggedError('OrgParseError')<{
  cause: ParseError;
}> {}

class OrgSlugParseError extends Data.TaggedError('OrgSlugParseError')<{
  cause: ParseError;
}> {}

export const orgNameSchema = Schema.Trim.pipe(
  Schema.minLength(2, {
    message: () => 'Organization name must be at least 2 characters',
  }),
  Schema.maxLength(100, {
    message: () => 'Organization name cannot be more than 100 characters',
  })
);

export const orgIdSchema = uuidSchema.pipe(Schema.brand(OrgIdBrand));
export const orgSlugSchema = Schema.String.pipe(Schema.minLength(2));

export class Org extends Schema.Class<Org>('Org')({
  id: orgIdSchema,
  name: orgNameSchema,
  slug: orgSlugSchema,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
}) {
  static fromUnknown = compose(
    Schema.decodeUnknown(this),
    Effect.mapError((cause) => new OrgParseError({cause}))
  );

  static fromRecord(record: orgs.JSONSelectable) {
    return Org.fromUnknown({
      id: record.id,
      name: record.name,
      slug: record.slug,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    });
  }

  getRecord() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      updated_at: db.toString(this.updatedAt, 'timestamptz'),
      created_at: db.toString(this.createdAt, 'timestamptz'),
    };
  }

  static slugify(text: string) {
    return Effect.sync(() => baseSlugify(text));
  }
}

export const parseOrgId = compose(
  Schema.decodeUnknown(orgIdSchema),
  Effect.mapError((cause) => new OrgIdParseError({cause}))
);

export const parseOrgSlug = compose(
  Schema.decodeUnknown(orgSlugSchema),
  Effect.mapError((cause) => new OrgSlugParseError({cause}))
);
