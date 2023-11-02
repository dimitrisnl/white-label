import * as Effect from 'effect/Effect';

import {db, pool} from '~/database/db.server.ts';
import type {Org, User} from '~/modules/domain/index.server.ts';
import {MembershipRole} from '~/modules/domain/index.server.ts';

import {DatabaseError, ForbiddenActionError} from '../errors.server.ts';

function getMembershipRecord(userId: User.User['id'], orgId: Org.Org['id']) {
  return Effect.tryPromise({
    try: () =>
      db.selectOne('memberships', {org_id: orgId, user_id: userId}).run(pool),
    catch: () => new DatabaseError(),
  });
}

export const invitationAuthorizationService = {
  canView: (userId: User.User['id'], orgId: Org.Org['id']) =>
    Effect.gen(function* (_) {
      const membershipRecord = yield* _(getMembershipRecord(userId, orgId));

      return membershipRecord
        ? yield* _(Effect.succeed(null))
        : yield* _(Effect.fail(new ForbiddenActionError()));
    }),

  canCreate: (userId: User.User['id'], orgId: Org.Org['id']) =>
    Effect.gen(function* (_) {
      const membershipRecord = yield* _(getMembershipRecord(userId, orgId));

      if (!membershipRecord) {
        return yield* _(Effect.fail(new ForbiddenActionError()));
      }

      const isOwner = membershipRecord.role === MembershipRole.OWNER;
      const isAdmin = membershipRecord.role === MembershipRole.ADMIN;
      const hasPermission = isOwner || isAdmin;

      return hasPermission
        ? yield* _(Effect.succeed(null))
        : yield* _(Effect.fail(new ForbiddenActionError()));
    }),

  canUpdate: (userId: User.User['id'], orgId: Org.Org['id']) =>
    Effect.gen(function* (_) {
      const membershipRecord = yield* _(getMembershipRecord(userId, orgId));

      if (!membershipRecord) {
        return yield* _(Effect.fail(new ForbiddenActionError()));
      }

      const isOwner = membershipRecord.role === MembershipRole.OWNER;
      const isAdmin = membershipRecord.role === MembershipRole.ADMIN;
      const hasPermission = isOwner || isAdmin;

      return hasPermission
        ? yield* _(Effect.succeed(null))
        : yield* _(Effect.fail(new ForbiddenActionError()));
    }),

  canDelete: (userId: User.User['id'], orgId: Org.Org['id']) =>
    Effect.gen(function* (_) {
      const membershipRecord = yield* _(getMembershipRecord(userId, orgId));

      if (!membershipRecord) {
        return yield* _(Effect.fail(new ForbiddenActionError()));
      }

      const hasPermission = membershipRecord.role === MembershipRole.OWNER;

      return hasPermission
        ? yield* _(Effect.succeed(null))
        : yield* _(Effect.fail(new ForbiddenActionError()));
    }),
};
