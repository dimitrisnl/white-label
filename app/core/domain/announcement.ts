import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import * as DateString from './date.server.ts';
import * as Org from './org.server.ts';
import * as Uuid from './uuid.server.ts';

const AnnouncementBrand = Symbol.for('AnnouncementBrand');
const AnnouncementIdBrand = Symbol.for('AnnouncementIdBrand');

export const announcementIdSchema = Uuid.uuidSchema.pipe(
  Schema.brand(AnnouncementIdBrand)
);

export const AnnouncementSchema = Schema.struct({
  id: Uuid.uuidSchema,
  orgId: Org.orgIdSchema,
  title: Schema.Trim.pipe(
    Schema.minLength(2, {
      message: () => 'Title must be at least 2 characters',
    }),
    Schema.maxLength(100, {
      message: () => 'Title cannot be more than 100 characters',
    })
  ),
  content: Schema.Trim.pipe(
    Schema.minLength(2, {
      message: () => 'Content must be at least 2 characters',
    })
  ),
  publishedAt: DateString.dateSchema,
  createdAt: DateString.dateSchema,
  updatedAt: DateString.dateSchema,
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
