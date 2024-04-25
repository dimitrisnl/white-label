import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import type {MembershipInvitation} from '~/core/domain/membership-invitation.server';
import {ADMIN, OWNER} from '~/core/domain/membership-role.server';
import type {Org} from '~/core/domain/org.server.ts';
import type {User} from '~/core/domain/user.server.ts';
import {DatabaseError, ForbiddenActionError} from '~/core/lib/errors.server';

export const invitationAuthorizationService = ({
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
      Effect.gen(function* () {
        const membershipRecord = yield* getMembershipRecord({userId, orgId});

        return membershipRecord
          ? yield* Effect.succeed(null)
          : yield* Effect.fail(
              new ForbiddenActionError({
                userId,
                action: 'view',
                resource: 'invitation',
                resourceId: 'all',
                resourceBelongsToOrgId: orgId,
                reason: 'User is not a member of the organization',
              })
            );
      }),

    canView: ({
      userId,
      orgId,
      invitationId,
    }: {
      userId: User['id'];
      orgId: Org['id'];
      invitationId: MembershipInvitation['id'];
    }) =>
      Effect.gen(function* () {
        const membershipRecord = yield* getMembershipRecord({userId, orgId});

        return membershipRecord
          ? yield* Effect.succeed(null)
          : yield* Effect.fail(
              new ForbiddenActionError({
                userId,
                action: 'view',
                resource: 'invitation',
                resourceId: invitationId,
                resourceBelongsToOrgId: orgId,
                reason: 'User is not a member of the organization',
              })
            );
      }),

    canCreate: ({userId, orgId}: {userId: User['id']; orgId: Org['id']}) =>
      Effect.gen(function* () {
        const membershipRecord = yield* getMembershipRecord({userId, orgId});

        if (!membershipRecord) {
          return yield* Effect.fail(
            new ForbiddenActionError({
              userId,
              action: 'create',
              resource: 'invitation',
              resourceId: 'N/A',
              resourceBelongsToOrgId: orgId,
              reason: 'User is not a member of the organization',
            })
          );
        }

        const isOwner = membershipRecord.role === OWNER;
        const isAdmin = membershipRecord.role === ADMIN;
        const hasPermission = isOwner || isAdmin;

        return hasPermission
          ? yield* Effect.succeed(null)
          : yield* Effect.fail(
              new ForbiddenActionError({
                userId,
                action: 'create',
                resource: 'invitation',
                resourceId: 'N/A',
                resourceBelongsToOrgId: orgId,
                reason: 'User does not have permission to create invitations',
              })
            );
      }),

    canUpdate: ({
      userId,
      orgId,
      invitationId,
    }: {
      userId: User['id'];
      orgId: Org['id'];
      invitationId: MembershipInvitation['id'];
    }) =>
      Effect.gen(function* () {
        const membershipRecord = yield* getMembershipRecord({userId, orgId});

        if (!membershipRecord) {
          return yield* Effect.fail(
            new ForbiddenActionError({
              userId,
              action: 'update',
              resource: 'invitation',
              resourceId: invitationId,
              resourceBelongsToOrgId: orgId,
              reason: 'User is not a member of the organization',
            })
          );
        }

        const isOwner = membershipRecord.role === OWNER;
        const isAdmin = membershipRecord.role === ADMIN;
        const hasPermission = isOwner || isAdmin;

        return hasPermission
          ? yield* Effect.succeed(null)
          : yield* Effect.fail(
              new ForbiddenActionError({
                userId,
                action: 'update',
                resource: 'invitation',
                resourceId: invitationId,
                resourceBelongsToOrgId: orgId,
                reason: 'User does not have permission to update invitations',
              })
            );
      }),

    canDelete: ({
      userId,
      orgId,
      invitationId,
    }: {
      userId: User['id'];
      orgId: Org['id'];
      invitationId: MembershipInvitation['id'];
    }) =>
      Effect.gen(function* () {
        const membershipRecord = yield* getMembershipRecord({userId, orgId});

        if (!membershipRecord) {
          return yield* Effect.fail(
            new ForbiddenActionError({
              userId,
              action: 'delete',
              resource: 'invitation',
              resourceId: invitationId,
              resourceBelongsToOrgId: orgId,
              reason: 'User is not a member of the organization',
            })
          );
        }

        const hasPermission = membershipRecord.role === OWNER;

        return hasPermission
          ? yield* Effect.succeed(null)
          : yield* Effect.fail(
              new ForbiddenActionError({
                userId,
                action: 'delete',
                resource: 'invitation',
                resourceId: invitationId,
                resourceBelongsToOrgId: orgId,
                reason: 'User does not have permission to delete invitations',
              })
            );
      }),
  };
};
