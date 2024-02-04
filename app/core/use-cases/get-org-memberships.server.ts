import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server';
import {
  DatabaseError,
  InternalServerError,
  OrgNotFoundError,
} from '~/core/lib/errors.server';
import {orgAuthorizationService} from '~/core/services/org-authorization-service.server';

import {Membership} from '../domain/membership.server';
import {Org} from '../domain/org.server';
import type {User} from '../domain/user.server';

export function getOrgMemberships() {
  function execute({orgId, userId}: {orgId: Org['id']; userId: User['id']}) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `(get-org-memberships): Getting memberships for org ${orgId} for user ${userId}`
        )
      );

      yield* _(orgAuthorizationService.canViewAll({userId, orgId}));

      const orgRecord = yield* _(
        Effect.tryPromise({
          try: () => db.selectOne('orgs', {id: orgId}).run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (!orgRecord) {
        return yield* _(Effect.fail(new OrgNotFoundError()));
      }

      const org = yield* _(Org.fromRecord(orgRecord));

      const membershipRecords = yield* _(
        Effect.tryPromise({
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
        })
      );

      const memberships = yield* _(
        Effect.all(
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
