import * as Effect from 'effect/Effect';

import {db, pool} from '~/database/db.server.ts';
import {User} from '~/modules/domain/index.server.ts';
import {
  DatabaseError,
  InternalServerError,
  UserNotFoundError,
} from '~/modules/errors.server.ts';

import type {EditUserProps} from './validation.server.ts';
import {validate} from './validation.server.ts';

function updateUserRecord({
  id,
  name,
}: {
  id: User.User['id'];
  name: User.User['name'];
}) {
  return Effect.tryPromise({
    try: () => db.update('users', {name}, {id}).run(pool),
    catch: () => new DatabaseError(),
  });
}

export function editUser() {
  function execute(props: EditUserProps, userId: User.User['id']) {
    const {name} = props;
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(edit-user): Editing user ${userId} with name ${name}`
        )
      );
      const [userRecord] = yield* _(updateUserRecord({id: userId, name}));

      if (!userRecord) {
        yield* _(
          Effect.logError(`
          Use-case(edit-user): User ${userId} not found`)
        );
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      const user = yield* _(User.dbRecordToDomain(userRecord));
      return user;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {
    execute,
    validate,
  };
}
