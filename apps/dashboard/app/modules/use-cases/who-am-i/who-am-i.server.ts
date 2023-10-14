import * as Effect from 'effect/Effect';

import {db, pool} from '@/database/db.server';
import {Membership, User} from '@/modules/domain/index.server';
import {
  DatabaseError,
  InternalServerError,
  UserNotFoundError,
} from '@/modules/errors.server';

function selectUserRecord(id: User.User['id']) {
  return Effect.tryPromise({
    try: () =>
      db
        .selectOne(
          'users',
          {id},
          {
            lateral: {
              memberships: db.select(
                'memberships',
                {user_id: id},
                {
                  lateral: {
                    org: db.selectExactlyOne(
                      'orgs',
                      {id: db.parent('org_id')},
                      {columns: ['name', 'slug']}
                    ),
                  },
                }
              ),
            },
          }
        )
        .run(pool),
    catch: () => new DatabaseError(),
  });
}

export function whoAmI() {
  function execute(userId: User.User['id']) {
    return Effect.gen(function* (_) {
      yield* _(Effect.log(`Use-case(who-am-i): Getting user ${userId}`));
      const userRecord = yield* _(selectUserRecord(userId));

      if (!userRecord) {
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      const user = yield* _(User.dbRecordToDomain(userRecord));
      const membershipRecords = userRecord.memberships;

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
              {name: user.name, id: user.id, email: user.email}
            )
          )
        )
      );

      return {user, memberships};
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {execute};
}
