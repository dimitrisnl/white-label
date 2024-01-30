import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import * as Announcement from '~/core/domain/announcement.server.ts';
import type * as Org from '~/core/domain/org.server.ts';
import type * as User from '~/core/domain/user.server.ts';
import * as Uuid from '~/core/domain/uuid.server.ts';
import {DatabaseError, InternalServerError} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

const validationSchema = Schema.struct({
  title: Announcement.announcementTitleSchema,
  content: Announcement.announcementContentSchema,
});

export type CreateAnnouncementProps = Schema.Schema.To<typeof validationSchema>;

export function createAnnouncement() {
  function execute(
    {content, title}: CreateAnnouncementProps,
    orgId: Org.Org['id'],
    userId: User.User['id']
  ) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(create-announcement): Creating announcement for org:${orgId} by user:${userId}`
        )
      );

      const announcementId = yield* _(Uuid.generate());

      const announcementRecord = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .insert('announcements', {
                id: announcementId,
                title,
                content,
                org_id: orgId,
              })
              .run(pool),
          catch: () => {
            return new DatabaseError();
          },
        })
      );

      const announcement = yield* _(
        Announcement.dbRecordToDomain(announcementRecord)
      );

      return announcement;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
        UUIDGenerationError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
