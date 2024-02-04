import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server';
import {
  AnnouncementNotFoundError,
  DatabaseError,
  InternalServerError,
} from '~/core/lib/errors.server';

import {Announcement} from '../domain/announcement.server';
import type {Org} from '../domain/org.server';
import type {User} from '../domain/user.server';
import {announcementAuthorizationService} from '../services/announcement-authorization-service.server';

export function getAnnouncement() {
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

      yield* _(announcementAuthorizationService.canView(userId, orgId));

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
        DatabaseError: () => Effect.fail(new InternalServerError()),
        AnnouncementParseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {execute};
}
