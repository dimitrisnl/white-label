import * as Effect from 'effect/Effect';

import {db, pool} from '@/database/db.server';
import {User} from '@/modules/domain/index.server';
import {DatabaseError, InternalServerError} from '@/modules/errors.server';

import type {EditUserProps} from './validation.server';
import {validate} from './validation.server';

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
