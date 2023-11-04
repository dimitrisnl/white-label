import * as Effect from 'effect/Effect';

import {db, pool} from '~/database/db.server.ts';
import type {User} from '~/modules/domain/index.server.ts';
import {Membership} from '~/modules/domain/index.server.ts';
import {DatabaseError, InternalServerError} from '~/modules/errors.server.ts';

function selectMemberships(id: User.User['id']) {
  return Effect.tryPromise({
    try: () =>
      db
        .select(
          'memberships',
          {user_id: id},
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
}

export function getUserMemberships() {
  function execute(userId: User.User['id']) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(get-user-memberships): Getting memberships for user ${userId}`
        )
      );
      const membershipRecords = yield* _(selectMemberships(userId));

      const memberships = yield* _(
        Effect.all(
          membershipRecords.map((membershipRecord) =>
            Membership.dbRecordToDomain(
              membershipRecord,
              {
                name: membershipRecord.org.name,
                id: membershipRecord.org_id,
                slug: membershipRecord.org.slug,
              },
              {
                name: membershipRecord.user.name,
                id: membershipRecord.user_id,
                email: membershipRecord.user.email,
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
