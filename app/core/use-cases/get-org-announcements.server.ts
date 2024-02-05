import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import {Announcement} from '~/core/domain/announcement.server';
import type {Org} from '~/core/domain/org.server';
import type {User} from '~/core/domain/user.server';
import {DatabaseError, InternalServerError} from '~/core/lib/errors.server';
import {announcementAuthorizationService} from '~/core/services/announcement-authorization-service.server';

export function getOrgAnnouncements({pool, db}: {pool: PgPool; db: DB}) {
  function execute({orgId, userId}: {orgId: Org['id']; userId: User['id']}) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `(get-org-announcements): Getting announcements for org ${orgId} for user ${userId}`
        )
      );

      yield* _(
        announcementAuthorizationService({
          pool,
          db,
        }).canViewAll({userId, orgId})
      );

      const announcementRecords = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .select(
                'announcements',
                {org_id: orgId},
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

      const announcements = yield* _(
        Effect.all(
          announcementRecords.map(
            (announcementRecord) =>
              Announcement.fromRecord({
                record: announcementRecord,
                createdByUser: announcementRecord.created_by_user,
                publishedByUser: announcementRecord.published_by_user,
              }),
            {concurrency: 'unbounded'}
          )
        )
      );

      return announcements;
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
