import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server';
import {User} from '~/core/domain/user.server.ts';
import {
  DatabaseError,
  InternalServerError,
  UserNotFoundError,
} from '~/core/lib/errors.server';

export function getUser() {
  function execute({userId}: {userId: User['id']}) {
    return Effect.gen(function* (_) {
      yield* _(Effect.log(`(get-user): Getting user ${userId}`));
      const userRecord = yield* _(
        Effect.tryPromise({
          try: () => db.selectOne('users', {id: userId}).run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (!userRecord) {
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      const user = yield* _(User.fromRecord(userRecord));

      return {user};
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        UserParseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {execute};
}
