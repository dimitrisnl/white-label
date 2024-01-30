import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {DbRecordParseError} from '../lib/errors.server.ts';
import * as DateString from './date.server.ts';
import * as Org from './org.server.ts';
import * as Uuid from './uuid.server.ts';

const AnnouncementBrand = Symbol.for('AnnouncementBrand');
const AnnouncementIdBrand = Symbol.for('AnnouncementIdBrand');

export const announcementIdSchema = Uuid.uuidSchema.pipe(
  Schema.brand(AnnouncementIdBrand)
);

export const announcementTitleSchema = Schema.Trim.pipe(
  Schema.minLength(2, {
    message: () => 'Title must be at least 2 characters',
  }),
  Schema.maxLength(100, {
    message: () => 'Title cannot be more than 100 characters',
  })
);

export const announcementContentSchema = Schema.Trim.pipe(
  Schema.minLength(2, {
    message: () => 'Content must be at least 2 characters',
  }),
  Schema.maxLength(100, {
    message: () => 'Content cannot be more than 100 characters',
  })
);

export const AnnouncementSchema = Schema.struct({
  id: Uuid.uuidSchema,
  orgId: Org.orgIdSchema,
  title: announcementTitleSchema,
  content: announcementContentSchema,
  publishedAt: DateString.dateSchema,
  createdAt: DateString.dateSchema,
  updatedAt: Schema.compose(DateString.dateSchema, Schema.null),
}).pipe(Schema.brand(AnnouncementBrand));

export type Announcement = Schema.Schema.To<typeof AnnouncementSchema>;

export class ParseAnnouncementError {
  readonly _tag = 'ParseAnnouncementError';
}

export function parse(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(AnnouncementSchema)(value),
    catch: () => new ParseAnnouncementError(),
  });
}

export function dbRecordToDomain(entity: {
  id: string;
  title: string;
  content: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}) {
  return parse({
    id: entity.id,
    title: entity.title,
    content: entity.content,
    publishedAt: entity.published_at,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
  }).pipe(Effect.catchAll(() => Effect.fail(new DbRecordParseError())));
}
