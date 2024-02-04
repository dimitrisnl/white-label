import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import type {Org} from '~/core/domain/org.server.ts';
import type {User} from '~/core/domain/user.server.ts';
import {DatabaseError, ForbiddenActionError} from '~/core/lib/errors.server';

import type {MembershipInvitation} from '../domain/membership-invitation.server';
import {ADMIN, OWNER} from '../domain/membership-role.server';

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

export const invitationAuthorizationService = {
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
                resource: 'invitation',
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
    invitationId,
  }: {
    userId: User['id'];
    orgId: Org['id'];
    invitationId: MembershipInvitation['id'];
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
                resource: 'invitation',
                resourceId: invitationId,
                resourceBelongsToOrgId: orgId,
                reason: 'User is not a member of the organization',
              })
            )
          );
    }),

  canCreate: ({userId, orgId}: {userId: User['id']; orgId: Org['id']}) =>
    Effect.gen(function* (_) {
      const membershipRecord = yield* _(getMembershipRecord({userId, orgId}));

      if (!membershipRecord) {
        return yield* _(
          Effect.fail(
            new ForbiddenActionError({
              userId,
              action: 'create',
              resource: 'invitation',
              resourceId: 'N/A',
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
                action: 'create',
                resource: 'invitation',
                resourceId: 'N/A',
                resourceBelongsToOrgId: orgId,
                reason: 'User does not have permission to create invitations',
              })
            )
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
    Effect.gen(function* (_) {
      const membershipRecord = yield* _(getMembershipRecord({userId, orgId}));

      if (!membershipRecord) {
        return yield* _(
          Effect.fail(
            new ForbiddenActionError({
              userId,
              action: 'update',
              resource: 'invitation',
              resourceId: invitationId,
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
                resource: 'invitation',
                resourceId: invitationId,
                resourceBelongsToOrgId: orgId,
                reason: 'User does not have permission to update invitations',
              })
            )
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
    Effect.gen(function* (_) {
      const membershipRecord = yield* _(getMembershipRecord({userId, orgId}));

      if (!membershipRecord) {
        return yield* _(
          Effect.fail(
            new ForbiddenActionError({
              userId,
              action: 'delete',
              resource: 'invitation',
              resourceId: invitationId,
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
                resource: 'invitation',
                resourceId: invitationId,
                resourceBelongsToOrgId: orgId,
                reason: 'User does not have permission to delete invitations',
              })
            )
          );
    }),
};
