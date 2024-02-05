import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import {ADMIN, OWNER} from '~/core/domain/membership-role.server';
import type {Org} from '~/core/domain/org.server.ts';
import type {User} from '~/core/domain/user.server.ts';
import {DatabaseError, ForbiddenActionError} from '~/core/lib/errors.server';

export const orgAuthorizationService = ({pool, db}: {pool: PgPool; db: DB}) => {
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
                  resource: 'org',
                  resourceId: orgId,
                  resourceBelongsToOrgId: orgId,
                  reason: 'User is not a member of the organization',
                })
              )
            );
      }),

    canView: ({userId, orgId}: {userId: User['id']; orgId: Org['id']}) =>
      Effect.gen(function* (_) {
        const membershipRecord = yield* _(getMembershipRecord({userId, orgId}));

        return membershipRecord
          ? yield* _(Effect.succeed(null))
          : yield* _(
              Effect.fail(
                new ForbiddenActionError({
                  userId,
                  action: 'view',
                  resource: 'org',
                  resourceId: orgId,
                  resourceBelongsToOrgId: orgId,
                  reason: 'User is not a member of the organization',
                })
              )
            );
      }),

    canUpdate: ({userId, orgId}: {userId: User['id']; orgId: Org['id']}) =>
      Effect.gen(function* (_) {
        const membershipRecord = yield* _(getMembershipRecord({userId, orgId}));

        if (!membershipRecord) {
          return yield* _(
            Effect.fail(
              new ForbiddenActionError({
                userId,
                action: 'update',
                resource: 'org',
                resourceId: orgId,
                resourceBelongsToOrgId: orgId,
                reason: 'User is not a member of the organization',
              })
            )
          );
        }

        const isOwner = membershipRecord.role === OWNER;
        const isAdmin = membershipRecord.role === ADMIN;
        const hasPermission = isOwner || isAdmin;

        return hasPermission
          ? yield* _(Effect.succeed(null))
          : yield* _(
              Effect.fail(
                new ForbiddenActionError({
                  userId,
                  action: 'update',
                  resource: 'org',
                  resourceId: orgId,
                  resourceBelongsToOrgId: orgId,
                  reason:
                    'User does not have permission to update the organization',
                })
              )
            );
      }),

    canDelete: ({userId, orgId}: {userId: User['id']; orgId: Org['id']}) =>
      Effect.gen(function* (_) {
        const membershipRecord = yield* _(getMembershipRecord({userId, orgId}));

        if (!membershipRecord) {
          return yield* _(
            Effect.fail(
              new ForbiddenActionError({
                userId,
                action: 'delete',
                resource: 'org',
                resourceId: orgId,
                resourceBelongsToOrgId: orgId,
                reason: 'User is not a member of the organization',
              })
            )
          );
        }

        const hasPermission = membershipRecord.role === OWNER;

        return hasPermission
          ? yield* _(Effect.succeed(null))
          : yield* _(
              Effect.fail(
                new ForbiddenActionError({
                  userId,
                  action: 'delete',
                  resource: 'org',
                  resourceId: orgId,
                  resourceBelongsToOrgId: orgId,
                  reason:
                    'User does not have permission to delete the organization',
                })
              )
            );
      }),
  };
};
