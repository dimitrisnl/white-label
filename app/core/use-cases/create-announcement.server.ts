import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import {
  announcementContentSchema,
  announcementTitleSchema,
} from '~/core/domain/announcement.server';
import {announcementStatusSchema} from '~/core/domain/announcement-status.server';
import type {Org} from '~/core/domain/org.server';
import type {User} from '~/core/domain/user.server';
import {generateUUID} from '~/core/domain/uuid.server';
import {DatabaseError, InternalServerError} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';
import {announcementAuthorizationService} from '~/core/services/announcement-authorization-service.server';

const validationSchema = Schema.Struct({
  title: announcementTitleSchema,
  content: announcementContentSchema,
  status: announcementStatusSchema,
});

export type CreateAnnouncementProps = Schema.Schema.Type<
  typeof validationSchema
>;

export function createAnnouncement({pool, db}: {pool: PgPool; db: DB}) {
  function execute({
    props: {content, title, status},
    orgId,
    userId,
  }: {
    props: CreateAnnouncementProps;
    orgId: Org['id'];
    userId: User['id'];
  }) {
    return Effect.gen(function* () {
      yield* Effect.log(
        `(create-announcement): Creating announcement for org:${orgId} by user:${userId}`
      );

      yield* announcementAuthorizationService({pool, db}).canCreate({
        userId,
        orgId,
      });

      const announcementId = yield* generateUUID();

      yield* Effect.tryPromise({
        try: () =>
          db
            .insert('announcements', {
              id: announcementId,
              title,
              content,
              status,
              org_id: orgId,
              created_by_user_id: userId,
            })
            .run(pool),
        catch: () => {
          return new DatabaseError();
        },
      });

      return null;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () =>
          Effect.fail(new InternalServerError({reason: 'Database error'})),
        UUIDGenerationError: () =>
          Effect.fail(
            new InternalServerError({reason: 'UUID generation error'})
          ),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
