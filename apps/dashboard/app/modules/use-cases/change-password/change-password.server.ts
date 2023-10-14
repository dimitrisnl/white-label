import * as Effect from 'effect/Effect';

import {db, pool} from '@/database/db.server';
import type {User} from '@/modules/domain/index.server';
import {Password} from '@/modules/domain/index.server';
import {
  DatabaseError,
  IncorrectPasswordError,
  InternalServerError,
  UserNotFoundError,
} from '@/modules/errors.server';

import type {ChangePasswordProps} from './validation.server';
import {validate} from './validation.server';

function selectUserRecord(userId: User.User['id']) {
  return Effect.tryPromise({
    try: () => db.selectOne('users', {id: userId}).run(pool),
    catch: () => new DatabaseError(),
  });
}

function updateUserPassword(userId: User.User['id'], password: string) {
  return Effect.tryPromise({
    try: () => db.update('users', {password}, {id: userId}).run(pool),
    catch: () => new DatabaseError(),
  });
}

export function changePassword() {
  function execute(props: ChangePasswordProps, userId: User.User['id']) {
    const {newPassword, oldPassword} = props;
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(change-password): Changing password for user ${userId}`
        )
      );

      const userRecord = yield* _(selectUserRecord(userId));

      if (!userRecord) {
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      const isPasswordValid = yield* _(
        Password.compare({
          plainText: oldPassword,
          hashValue: userRecord.password,
        })
      );

      if (!isPasswordValid) {
        return yield* _(Effect.fail(new IncorrectPasswordError()));
      }

      const hashedNewPassword = yield* _(Password.hash(newPassword));

      yield* _(updateUserPassword(userId, hashedNewPassword));

      return null;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
        PasswordHashError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {
    execute,
    validate,
  };
}
