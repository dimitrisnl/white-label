import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server';
import {DatabaseError, InternalServerError} from '~/core/lib/errors.server';

import {Membership} from '../domain/membership.server';
import type {User} from '../domain/user.server';

export function getUserMemberships() {
  function execute({userId}: {userId: User['id']}) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `(get-user-memberships): Getting memberships for user ${userId}`
        )
      );
      const membershipRecords = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .select(
                'memberships',
                {user_id: userId},
                {
                  lateral: {
                    org: db.selectExactlyOne(
                      'orgs',
                      {id: db.parent('org_id')},
                      {columns: ['name', 'slug']}
                    ),
                    user: db.selectExactlyOne(
                      'users',
                      {id: db.parent('user_id')},
                      {columns: ['name', 'email']}
                    ),
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
              org: {
                name: membershipRecord.org.name,
                id: membershipRecord.org_id,
                slug: membershipRecord.org.slug,
              },
              user: {
                name: membershipRecord.user.name,
                id: membershipRecord.user_id,
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
            new InternalServerError({reason: 'Error parsing membership'})
          ),
      })
    );
  }

  return {
    execute,
  };
}
