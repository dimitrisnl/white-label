import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import {DatabaseError, InternalServerError} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

import {
  announcementContentSchema,
  announcementTitleSchema,
} from '../domain/announcement.server';
import type {Org} from '../domain/org.server';
import type {User} from '../domain/user.server';
import {generateUUID} from '../domain/uuid.server';

const validationSchema = Schema.struct({
  title: announcementTitleSchema,
  content: announcementContentSchema,
});

export type CreateAnnouncementProps = Schema.Schema.To<typeof validationSchema>;

export function createAnnouncement() {
  function execute(
    {content, title}: CreateAnnouncementProps,
    orgId: Org['id'],
    userId: User['id']
  ) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(create-announcement): Creating announcement for org:${orgId} by user:${userId}`
        )
      );

      const announcementId = yield* _(generateUUID());

      yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .insert('announcements', {
                id: announcementId,
                title,
                content,
                org_id: orgId,
                created_by_user_id: userId,
              })
              .run(pool),
          catch: () => {
            return new DatabaseError();
          },
        })
      );

      return null;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
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
