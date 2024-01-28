import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server';
import * as MembershipRole from '~/core/domain/membership-role.server.ts';
import type {Org} from '~/core/domain/org.server.ts';
import type {User} from '~/core/domain/user.server.ts';
import {DatabaseError, ForbiddenActionError} from '~/core/lib/errors.server';

function getMembershipRecord(userId: User['id'], orgId: Org['id']) {
  return Effect.tryPromise({
    try: () =>
      db.selectOne('memberships', {org_id: orgId, user_id: userId}).run(pool),
    catch: () => new DatabaseError(),
  });
}

export const orgAuthorizationService = {
  canView: (userId: User['id'], orgId: Org['id']) =>
    Effect.gen(function* (_) {
      const membershipRecord = yield* _(getMembershipRecord(userId, orgId));

      return membershipRecord
        ? yield* _(Effect.succeed(null))
        : yield* _(Effect.fail(new ForbiddenActionError()));
    }),

  canUpdate: (userId: User['id'], orgId: Org['id']) =>
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

  canDelete: (userId: User['id'], orgId: Org['id']) =>
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