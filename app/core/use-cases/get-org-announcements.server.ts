import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server';
import * as Announcement from '~/core/domain/announcement.server.ts';
import type * as Org from '~/core/domain/org.server.ts';
import type * as User from '~/core/domain/user.server.ts';
import {DatabaseError, InternalServerError} from '~/core/lib/errors.server';

import {announcementAuthorizationService} from '../services/announcement-authorization-service.server';

export function getOrgAnnouncements() {
  function execute(orgId: Org.Org['id'], userId: User.User['id']) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(get-org-announcements): Getting announcements for org ${orgId} for user ${userId}`
        )
      );

      yield* _(announcementAuthorizationService.canView(userId, orgId));

      const announcementRecords = yield* _(
        Effect.tryPromise({
          try: () => db.select('announcements', {org_id: orgId}).run(pool),
          catch: () => new DatabaseError(),
        })
      );

      const announcements = yield* _(
        Effect.all(
          announcementRecords.map(
            (announcementRecord) =>
              Announcement.dbRecordToDomain(announcementRecord),
            {concurrency: 'unbounded'}
          )
        )
      );

      return announcements;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {execute};
}
