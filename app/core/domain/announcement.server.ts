import type {ParseError} from '@effect/schema/ParseResult';
import * as Schema from '@effect/schema/Schema';
import {Data, Effect} from 'effect';
import {compose} from 'effect/Function';
import type {announcements} from 'zapatos/schema';

import {db} from '../db/db.server.ts';
import {orgIdSchema} from './org.server.ts';
import {uuidSchema} from './uuid.server.ts';

class AnnouncementIdParseError extends Data.TaggedError(
  'AnnouncementIdParseError'
)<{
  cause: ParseError;
}> {}

class AnnouncementParseError extends Data.TaggedError(
  'AnnouncementParseError'
)<{
  cause: ParseError;
}> {}

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

const AnnouncementIdBrand = Symbol.for('AnnouncementIdBrand');
export const announcementIdSchema = uuidSchema.pipe(
  Schema.brand(AnnouncementIdBrand)
);

export class Announcement extends Schema.Class<Announcement>()({
  id: uuidSchema,
  orgId: orgIdSchema,
  title: announcementTitleSchema,
  content: announcementContentSchema,
  publishedAt: Schema.Date,
  createdAt: Schema.Date,
  updatedAt: Schema.union(Schema.Date, Schema.null),
}) {
  static fromUnknown = compose(
    Schema.decodeUnknown(this),
    Effect.mapError((cause) => new AnnouncementParseError({cause}))
  );

  static fromRecord(record: announcements.JSONSelectable) {
    return Announcement.fromUnknown({
      id: record.id,
      title: record.title,
      orgId: record.org_id,
      content: record.content,
      publishedAt: record.published_at,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    });
  }

  getRecord(): announcements.JSONSelectable {
    return {
      id: this.id,
      content: this.content,
      title: this.title,
      org_id: this.orgId,
      published_at: db.toString(this.publishedAt, 'timestamptz'),
      created_at: db.toString(this.createdAt, 'timestamptz'),
      updated_at: this.updatedAt
        ? db.toString(this.updatedAt, 'timestamptz')
        : null,
    };
  }
}

export const parseAnnouncementId = compose(
  Schema.decodeUnknown(announcementIdSchema),
  Effect.mapError((cause) => new AnnouncementIdParseError({cause}))
);
