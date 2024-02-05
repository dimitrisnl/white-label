import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import type {Announcement} from '~/core/domain/announcement.server';
import type {Org} from '~/core/domain/org.server.ts';
import type {User} from '~/core/domain/user.server.ts';
import {DatabaseError, ForbiddenActionError} from '~/core/lib/errors.server';

export const announcementAuthorizationService = ({
  pool,
  db,
}: {
  pool: PgPool;
  db: DB;
}) => {
  function getMembershipRecord({
    userId,
    orgId,
  }: {
    userId: User['id'];
    orgId: Org['id'];
  }) {
    return Effect.tryPromise({
      try: () =>
        db.selectOne('memberships', {org_id: orgId, user_id: userId}).run(pool),
      catch: () => new DatabaseError(),
    });
  }

  return {
    canViewAll: ({userId, orgId}: {userId: User['id']; orgId: Org['id']}) =>
      Effect.gen(function* (_) {
        const membershipRecord = yield* _(getMembershipRecord({userId, orgId}));

        return membershipRecord
          ? yield* _(Effect.succeed(null))
          : yield* _(
              Effect.fail(
                new ForbiddenActionError({
                  userId,
                  action: 'view',
                  resource: 'announcement',
                  resourceId: 'all',
                  resourceBelongsToOrgId: orgId,
                  reason: 'User is not a member of the organization',
                })
              )
            );
      }),

    canView: ({
      userId,
      orgId,
      announcementId,
    }: {
      userId: User['id'];
      orgId: Org['id'];
      announcementId: Announcement['id'];
    }) =>
      Effect.gen(function* (_) {
        const membershipRecord = yield* _(getMembershipRecord({userId, orgId}));

        return membershipRecord
          ? yield* _(Effect.succeed(null))
          : yield* _(
              Effect.fail(
                new ForbiddenActionError({
                  userId,
                  action: 'view',
                  resource: 'announcement',
                  resourceId: announcementId,
                  resourceBelongsToOrgId: orgId,
                  reason: 'User is not a member of the organization',
                })
              )
            );
      }),

    canCreate: ({userId, orgId}: {userId: User['id']; orgId: Org['id']}) =>
      Effect.gen(function* (_) {
        const membershipRecord = yield* _(getMembershipRecord({userId, orgId}));

        return membershipRecord
          ? yield* _(Effect.succeed(null))
          : yield* _(
              Effect.fail(
                new ForbiddenActionError({
                  userId,
                  action: 'create',
                  resource: 'announcement',
                  resourceId: 'N/A',
                  resourceBelongsToOrgId: orgId,
                  reason: 'User is not a member of the organization',
                })
              )
            );
      }),

    canUpdate: ({
      userId,
      orgId,
      announcementId,
    }: {
      userId: User['id'];
      orgId: Org['id'];
      announcementId: Announcement['id'];
    }) =>
      Effect.gen(function* (_) {
        const membershipRecord = yield* _(getMembershipRecord({userId, orgId}));

        return membershipRecord
          ? yield* _(Effect.succeed(null))
          : yield* _(
              Effect.fail(
                new ForbiddenActionError({
                  userId,
                  action: 'update',
                  resource: 'announcement',
                  resourceId: announcementId,
                  resourceBelongsToOrgId: orgId,
                  reason: 'User is not a member of the organization',
                })
              )
            );
      }),

    canDelete: ({
      userId,
      orgId,
      announcementId,
    }: {
      userId: User['id'];
      orgId: Org['id'];
      announcementId: Announcement['id'];
    }) =>
      Effect.gen(function* (_) {
        const membershipRecord = yield* _(getMembershipRecord({userId, orgId}));

        return membershipRecord
          ? yield* _(Effect.succeed(null))
          : yield* _(
              Effect.fail(
                new ForbiddenActionError({
                  userId,
                  action: 'delete',

                  resource: 'announcement',
                  resourceId: announcementId,
                  resourceBelongsToOrgId: orgId,
                  reason: 'User is not a member of the organization',
                })
              )
            );
      }),
  };
};
