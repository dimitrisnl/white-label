import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import {Membership} from '~/core/domain/membership.server';
import {Org} from '~/core/domain/org.server';
import type {User} from '~/core/domain/user.server';
import {
  DatabaseError,
  InternalServerError,
  OrgNotFoundError,
} from '~/core/lib/errors.server';
import {orgAuthorizationService} from '~/core/services/org-authorization-service.server';

export function getOrgMemberships({pool, db}: {pool: PgPool; db: DB}) {
  function execute({orgId, userId}: {orgId: Org['id']; userId: User['id']}) {
    return Effect.gen(function* () {
      yield* Effect.log(
        `(get-org-memberships): Getting memberships for org ${orgId} for user ${userId}`
      );

      yield* orgAuthorizationService({pool, db}).canViewAll({userId, orgId});

      const orgRecord = yield* Effect.tryPromise({
        try: () => db.selectOne('orgs', {id: orgId}).run(pool),
        catch: () => new DatabaseError(),
      });

      if (!orgRecord) {
        return yield* Effect.fail(new OrgNotFoundError());
      }

      const org = yield* Org.fromRecord(orgRecord);

      const membershipRecords = yield* Effect.tryPromise({
        try: () =>
          db
            .select(
              'memberships',
              {org_id: orgId},
              {
                lateral: {
                  user: db.selectExactlyOne('users', {
                    id: db.parent('user_id'),
                  }),
                },
              }
            )
            .run(pool),
        catch: () => new DatabaseError(),
      });

      const memberships = yield* Effect.all(
        membershipRecords.map((membershipRecord) =>
          Membership.fromRecord({
            record: membershipRecord,
            org: {name: org.name, id: org.id, slug: org.slug},
            user: {
              name: membershipRecord.user.name,
              id: membershipRecord.user.id,
              email: membershipRecord.user.email,
            },
          })
        )
      );

      return {memberships};
    }).pipe(
      Effect.catchTags({
        DatabaseError: () =>
          Effect.fail(new InternalServerError({reason: 'Database error'})),
        MembershipParseError: () =>
          Effect.fail(
            new InternalServerError({reason: 'Membership parse error'})
          ),
        OrgParseError: () =>
          Effect.fail(
            new InternalServerError({reason: 'Error parsing org record'})
          ),
      })
    );
  }

  return {
    execute,
  };
}
