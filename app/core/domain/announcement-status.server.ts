import type {ParseError} from '@effect/schema/ParseResult';
import * as Schema from '@effect/schema/Schema';
import {Data, Effect} from 'effect';
import {compose} from 'effect/Function';

export const DRAFT = 'DRAFT' as const;
export const PUBLISHED = 'PUBLISHED' as const;

export const announcementStatusSchema = Schema.literal(DRAFT, PUBLISHED).pipe(
  Schema.message(
    () => "Invitation status must be one of 'DRAFT' or 'PUBLISHED'"
  )
);

export type AnnouncementStatus = Schema.Schema.To<
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
