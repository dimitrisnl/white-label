import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import type {Org} from '~/core/domain/org.server.ts';
import type {User} from '~/core/domain/user.server.ts';
import {DatabaseError, ForbiddenActionError} from '~/core/lib/errors.server';

import type {Announcement} from '../domain/announcement.server';

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

export const announcementAuthorizationService = {
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
