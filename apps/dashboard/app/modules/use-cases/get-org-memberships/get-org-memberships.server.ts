import * as Effect from 'effect/Effect';

import {db, pool} from '@/database/db.server.ts';
import type {User} from '@/modules/domain/index.server.ts';
import {Membership, Org} from '@/modules/domain/index.server.ts';
import {
  DatabaseError,
  InternalServerError,
  OrgNotFoundError,
} from '@/modules/errors.server.ts';
import {orgAuthorizationService} from '@/modules/services/index.server.ts';

function selectOrgRecord(id: Org.Org['id']) {
  return Effect.tryPromise({
    try: () => db.selectOne('orgs', {id}).run(pool),
    catch: () => new DatabaseError(),
  });
}

function selectMembershipRecords(orgId: Org.Org['id']) {
  return Effect.tryPromise({
    try: () =>
      db
        .select(
          'memberships',
          {org_id: orgId},
          {
            lateral: {
              user: db.select('users', {id: db.parent('user_id')}),
            },
          }
        )
        .run(pool),
    catch: () => new DatabaseError(),
  });
}

export function getOrgMemberships() {
  function execute(orgId: Org.Org['id'], userId: User.User['id']) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(get-org-memberships): Getting memberships for org ${orgId} for user ${userId}`
        )
      );
      yield* _(orgAuthorizationService.canView(userId, orgId));
      const orgRecord = yield* _(selectOrgRecord(orgId));

      if (!orgRecord) {
        return yield* _(Effect.fail(new OrgNotFoundError()));
      }

      const org = yield* _(Org.dbRecordToDomain(orgRecord));

      const membershipRecords = yield* _(selectMembershipRecords(orgId));

      const memberships = yield* _(
        Effect.all(
          membershipRecords.map((membershipRecord) =>
            Membership.dbRecordToDomain(
              membershipRecord,
              {name: org.name, id: org.id, slug: org.slug},
              {
                name: membershipRecord.user[0].name,
                id: membershipRecord.user[0].id,
                email: membershipRecord.user[0].email,
              }
            )
          )
        )
      );

      return {memberships};
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {
    execute,
  };
}
