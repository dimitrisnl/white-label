import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import {Membership} from '~/core/domain/membership.server';
import type {User} from '~/core/domain/user.server';
import {DatabaseError, InternalServerError} from '~/core/lib/errors.server';

export function getUserMemberships({pool, db}: {pool: PgPool; db: DB}) {
  function execute({userId}: {userId: User['id']}) {
    return Effect.gen(function* () {
      yield* Effect.log(
        `(get-user-memberships): Getting memberships for user ${userId}`
      );
      const membershipRecords = yield* Effect.tryPromise({
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
      });

      const memberships = yield* Effect.all(
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
