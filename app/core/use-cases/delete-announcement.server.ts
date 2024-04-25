import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import type {Org} from '~/core/domain/org.server';
import type {User} from '~/core/domain/user.server';
import {uuidSchema} from '~/core/domain/uuid.server';
import {
  AnnouncementNotFoundError,
  DatabaseError,
  InternalServerError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';
import {announcementAuthorizationService} from '~/core/services/announcement-authorization-service.server.ts';

const validationSchema = Schema.Struct({
  announcementId: uuidSchema,
});

export type DeleteAnnouncementProps = Schema.Schema.Type<
  typeof validationSchema
>;

export function deleteAnnouncement({pool, db}: {pool: PgPool; db: DB}) {
  function execute({
    props: {announcementId},
    userId,
    orgId,
  }: {
    props: DeleteAnnouncementProps;
    userId: User['id'];
    orgId: Org['id'];
  }) {
    return Effect.gen(function* () {
      yield* Effect.log(
        `(delete-announcement): Deleting announcement ${announcementId} by user ${userId} in org ${orgId}`
      );
      yield* announcementAuthorizationService({
        pool,
        db,
      }).canDelete({
        userId,
        orgId,
        announcementId,
      });

      const announcementRecord = yield* Effect.tryPromise({
        try: () => db.deletes('announcements', {id: announcementId}).run(pool),
        catch: () => new DatabaseError(),
      });

      if (announcementRecord.length === 0) {
        return yield* Effect.fail(new AnnouncementNotFoundError());
      }

      return null;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () =>
          Effect.fail(new InternalServerError({reason: 'Database error'})),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
