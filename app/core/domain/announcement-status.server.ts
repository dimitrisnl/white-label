import type {ParseError} from '@effect/schema/ParseResult';
import * as Schema from '@effect/schema/Schema';
import {Data, Effect} from 'effect';
import {compose} from 'effect/Function';

export const DRAFT = 'DRAFT' as const;
export const PUBLISHED = 'PUBLISHED' as const;

export const announcementStatusSchema = Schema.Literal(DRAFT, PUBLISHED).pipe(
  Schema.message(
    () => "Announcement status must be one of 'DRAFT' or 'PUBLISHED'"
  )
);

export type AnnouncementStatus = Schema.Schema.Type<
  typeof announcementStatusSchema
>;

class AnnouncementStatusParseError extends Data.TaggedError(
  'AnnouncementStatusParseError'
)<{
  cause: ParseError;
}> {}

export const parseAnnouncementStatus = compose(
  Schema.decodeUnknown(announcementStatusSchema),
  Effect.mapError((cause) => new AnnouncementStatusParseError({cause}))
);
