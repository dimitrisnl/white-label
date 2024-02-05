import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import {
  Announcement,
  announcementContentSchema,
  announcementTitleSchema,
} from '~/core/domain/announcement.server';
import {announcementStatusSchema} from '~/core/domain/announcement-status.server';
import type {Org} from '~/core/domain/org.server';
import type {User} from '~/core/domain/user.server';
import {
  AnnouncementNotFoundError,
  DatabaseError,
  InternalServerError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';
import {announcementAuthorizationService} from '~/core/services/announcement-authorization-service.server';

const validationSchema = Schema.struct({
  title: announcementTitleSchema,
  content: announcementContentSchema,
  status: announcementStatusSchema,
});

export type EditAnnouncementProps = Schema.Schema.To<typeof validationSchema>;

export function editAnnouncement({pool, db}: {pool: PgPool; db: DB}) {
  function execute({
    props: {title, content, status},
    announcementId,
    orgId,
    userId,
  }: {
    props: EditAnnouncementProps;
    announcementId: Announcement['id'];
    orgId: Org['id'];
    userId: User['id'];
  }) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `(edit-announcement): Editing announcement ${announcementId} for org ${orgId} by user ${userId}`
        )
      );

      yield* _(
        announcementAuthorizationService({pool, db}).canUpdate({
          userId,
          orgId,
          announcementId,
        })
      );

      const records = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .update(
                'announcements',
                {
                  title,
                  content,
                  status,
                  updated_at: db.sql`now()`,
                  published_by_user_id: status === 'PUBLISHED' ? userId : null,
                },
                {id: announcementId, org_id: orgId}
              )
              .run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (records.length === 0 || !records[0]) {
        return yield* _(Effect.fail(new AnnouncementNotFoundError()));
      }

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

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
