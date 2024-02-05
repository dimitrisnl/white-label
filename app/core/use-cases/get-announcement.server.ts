import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import {Announcement} from '~/core/domain/announcement.server';
import type {Org} from '~/core/domain/org.server';
import type {User} from '~/core/domain/user.server';
import {
  AnnouncementNotFoundError,
  DatabaseError,
  InternalServerError,
} from '~/core/lib/errors.server';
import {announcementAuthorizationService} from '~/core/services/announcement-authorization-service.server';

export function getAnnouncement({pool, db}: {pool: PgPool; db: DB}) {
  function execute({
    announcementId,
    orgId,
    userId,
  }: {
    announcementId: Announcement['id'];
    orgId: Org['id'];
    userId: User['id'];
  }) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `(get-announcement): Getting announcement ${announcementId} for org ${orgId} by user ${userId}`
        )
      );

      yield* _(
        announcementAuthorizationService({db, pool}).canView({
          userId,
          orgId,
          announcementId,
        })
      );

      const announcementRecord = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .selectOne(
                'announcements',
                {org_id: orgId, id: announcementId},
                {
                  lateral: {
                    created_by_user: db.selectOne(
                      'users',
                      {id: db.parent('created_by_user_id')},
                      {columns: ['id', 'name']}
                    ),
                    published_by_user: db.selectOne(
                      'users',
                      {id: db.parent('published_by_user_id')},
                      {columns: ['id', 'name']}
                    ),
                  },
                }
              )
              .run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (!announcementRecord) {
        return yield* _(Effect.fail(new AnnouncementNotFoundError()));
      }

      const announcement = yield* _(
        Announcement.fromRecord({
          record: announcementRecord,
          createdByUser: announcementRecord.created_by_user,
          publishedByUser: announcementRecord.published_by_user,
        })
      );

      return announcement;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () =>
          Effect.fail(new InternalServerError({reason: 'Database error'})),
        AnnouncementParseError: () =>
          Effect.fail(
            new InternalServerError({reason: 'Announcement parse error'})
          ),
      })
    );
  }

  return {execute};
}
