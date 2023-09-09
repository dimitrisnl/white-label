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
    try: () => db.selectOne('users', {id}).run(pool),
    catch: () => new DatabaseError(),
  });
}

function selectMembershipRecords(userId: User.User['id']) {
  return Effect.tryPromise({
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
                {columns: ['name']}
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
      const userRecord = yield* _(selectUserRecord(userId));

      if (!userRecord) {
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      const user = yield* _(User.dbRecordToDomain(userRecord));

      const membershipRecords = yield* _(selectMembershipRecords(userId));

      const memberships = yield* _(
        Effect.all(
          membershipRecords.map((membershipRecord) =>
            Membership.dbRecordToDomain(
              membershipRecord,
              {name: membershipRecord.org.name, id: membershipRecord.org_id},
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
