import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
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

export const announcementAuthorizationService = {
  canView: (userId: User['id'], orgId: Org['id']) =>
    Effect.gen(function* (_) {
      const membershipRecord = yield* _(getMembershipRecord(userId, orgId));

      return membershipRecord
        ? yield* _(Effect.succeed(null))
        : yield* _(Effect.fail(new ForbiddenActionError()));
    }),

  canCreate: (userId: User['id'], orgId: Org['id']) =>
    Effect.gen(function* (_) {
      const membershipRecord = yield* _(getMembershipRecord(userId, orgId));

      return membershipRecord
        ? yield* _(Effect.succeed(null))
        : yield* _(Effect.fail(new ForbiddenActionError()));
    }),

  canUpdate: (userId: User['id'], orgId: Org['id']) =>
    Effect.gen(function* (_) {
      const membershipRecord = yield* _(getMembershipRecord(userId, orgId));

      return membershipRecord
        ? yield* _(Effect.succeed(null))
        : yield* _(Effect.fail(new ForbiddenActionError()));
    }),

  canDelete: (userId: User['id'], orgId: Org['id']) =>
    Effect.gen(function* (_) {
      const membershipRecord = yield* _(getMembershipRecord(userId, orgId));

      return membershipRecord
        ? yield* _(Effect.succeed(null))
        : yield* _(Effect.fail(new ForbiddenActionError()));
    }),
};
