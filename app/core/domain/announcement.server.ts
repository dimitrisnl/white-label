import type {ParseError} from '@effect/schema/ParseResult';
import * as Schema from '@effect/schema/Schema';
import {Data, Effect} from 'effect';
import {compose} from 'effect/Function';
import type {announcements, users} from 'zapatos/schema';

import {db} from '../db/db.server.ts';
import {announcementStatusSchema} from './announcement-status.server.ts';
import {orgIdSchema} from './org.server.ts';
import {userIdSchema, userNameSchema} from './user.server.ts';
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
  status: announcementStatusSchema,
  createdByUser: Schema.nullable(
    Schema.struct({name: userNameSchema, id: userIdSchema})
  ),
  publishedByUser: Schema.nullable(
    Schema.struct({name: userNameSchema, id: userIdSchema})
  ),
  updatedAt: Schema.Date,
  createdAt: Schema.Date,
  publishedAt: Schema.nullable(Schema.Date),
}) {
  static fromUnknown = compose(
    Schema.decodeUnknown(this),
    Effect.mapError((cause) => new AnnouncementParseError({cause}))
  );

  static fromRecord({
    record,
    createdByUser,
    publishedByUser,
  }: {
    record: announcements.JSONSelectable;
    createdByUser: Pick<users.JSONSelectable, 'id' | 'name'> | null;
    publishedByUser: Pick<users.JSONSelectable, 'id' | 'name'> | null;
  }) {
    return Announcement.fromUnknown({
      id: record.id,
      title: record.title,
      orgId: record.org_id,
      content: record.content,
      status: record.status,
      createdByUser: createdByUser
        ? {id: createdByUser.id, name: createdByUser.name}
        : null,
      publishedByUser: publishedByUser
        ? {id: publishedByUser.id, name: publishedByUser.name}
        : null,
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
      created_by_user_id: this.createdByUser?.id ?? null,
      published_by_user_id: this.publishedByUser?.id ?? null,
      status: this.status,
      created_at: db.toString(this.createdAt, 'timestamptz'),
      updated_at: db.toString(this.updatedAt, 'timestamptz'),
      published_at: this.publishedAt
        ? db.toString(this.publishedAt, 'timestamptz')
        : null,
    };
  }
}

export const parseAnnouncementId = compose(
  Schema.decodeUnknown(announcementIdSchema),
  Effect.mapError((cause) => new AnnouncementIdParseError({cause}))
);
