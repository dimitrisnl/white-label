import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server';
import {DatabaseError, InternalServerError} from '~/core/lib/errors.server';

import {Announcement} from '../domain/announcement.server';
import type {Org} from '../domain/org.server';
import type {User} from '../domain/user.server';
import {announcementAuthorizationService} from '../services/announcement-authorization-service.server';

export function getOrgAnnouncements() {
  function execute({orgId, userId}: {orgId: Org['id']; userId: User['id']}) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `(get-org-announcements): Getting announcements for org ${orgId} for user ${userId}`
        )
      );

      yield* _(announcementAuthorizationService.canViewAll({userId, orgId}));

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
