import * as Effect from 'effect/Effect';

import {db, pool} from '~/database/db.server.ts';
import {User} from '~/modules/domain/index.server.ts';
import {
  DatabaseError,
  InternalServerError,
  UserNotFoundError,
} from '~/modules/errors.server.ts';

function selectUserRecord(id: User.User['id']) {
  return Effect.tryPromise({
    try: () => db.selectOne('users', {id}).run(pool),
    catch: () => new DatabaseError(),
  });
}

export function getUser() {
  function execute(userId: User.User['id']) {
    return Effect.gen(function* (_) {
      yield* _(Effect.log(`Use-case(get-user): Getting user ${userId}`));
      const userRecord = yield* _(selectUserRecord(userId));

      if (!userRecord) {
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      const user = yield* _(User.dbRecordToDomain(userRecord));

      return {user};
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {execute};
}
