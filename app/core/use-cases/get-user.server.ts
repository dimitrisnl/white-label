import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import {User} from '~/core/domain/user.server.ts';
import {
  DatabaseError,
  InternalServerError,
  UserNotFoundError,
} from '~/core/lib/errors.server';

export function getUser({pool, db}: {pool: PgPool; db: DB}) {
  function execute({userId}: {userId: User['id']}) {
    return Effect.gen(function* () {
      yield* Effect.log(`(get-user): Getting user ${userId}`);
      const userRecord = yield* Effect.tryPromise({
        try: () => db.selectOne('users', {id: userId}).run(pool),
        catch: () => new DatabaseError(),
      });

      if (!userRecord) {
        return yield* Effect.fail(new UserNotFoundError());
      }

      const user = yield* User.fromRecord(userRecord);

      return {user};
    }).pipe(
      Effect.catchTags({
        DatabaseError: () =>
          Effect.fail(new InternalServerError({reason: 'Database error'})),
        UserParseError: () =>
          Effect.fail(new InternalServerError({reason: 'Error parsing user'})),
      })
    );
  }

  return {execute};
}
