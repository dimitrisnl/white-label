import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import {
  AnnouncementNotFoundError,
  DatabaseError,
  InternalServerError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';
import {announcementAuthorizationService} from '~/core/services/announcement-authorization-service.server.ts';

import type {Org} from '../domain/org.server';
import type {User} from '../domain/user.server';
import {uuidSchema} from '../domain/uuid.server';

const validationSchema = Schema.struct({
  announcementId: uuidSchema,
});

export type DeleteAnnouncementProps = Schema.Schema.To<typeof validationSchema>;

export function deleteAnnouncement() {
  function execute({
    props: {announcementId},
    userId,
    orgId,
  }: {
    props: DeleteAnnouncementProps;
    userId: User['id'];
    orgId: Org['id'];
  }) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `(delete-announcement): Deleting announcement ${announcementId} by user ${userId} in org ${orgId}`
        )
      );
      yield* _(announcementAuthorizationService.canDelete(userId, orgId));

      const announcementRecord = yield* _(
        Effect.tryPromise({
          try: () =>
            db.deletes('announcements', {id: announcementId}).run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (announcementRecord.length === 0) {
        return yield* _(Effect.fail(new AnnouncementNotFoundError()));
      }

      return null;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
