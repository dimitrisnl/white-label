import * as Effect from 'effect/Effect';

import {db, pool} from '@/database/db.server';
import {Password} from '@/modules/domain/index.server';
import {
  DatabaseError,
  InternalServerError,
  PasswordResetTokenNotFoundError,
  UserNotFoundError,
} from '@/modules/errors.server';

import type {ResetPasswordProps} from './validation.server';
import {validate} from './validation.server';

function selectPasswordResetTokenRecord(token: string) {
  return Effect.tryPromise({
    try: () =>
      db
        .selectOne('password_reset_tokens', {
          id: token,
        })
        .run(pool),
    catch: () => new DatabaseError(),
  });
}

function selectUserRecord(userId: string) {
  return Effect.tryPromise({
    try: () =>
      db
        .selectOne('users', {
          id: userId,
        })
        .run(pool),
    catch: () => new DatabaseError(),
  });
}

function updateUserRecord({
  id,
  passwordHash,
}: {
  id: string;
  passwordHash: Password.Password;
}) {
  return Effect.tryPromise({
    try: () => db.update('users', {password: passwordHash}, {id}).run(pool),
    catch: () => new DatabaseError(),
  });
}

function deletePasswordResetTokenRecord(token: string) {
  return Effect.tryPromise({
    try: () => db.deletes('password_reset_tokens', {id: token}).run(pool),
    catch: () => new DatabaseError(),
  });
}

export function resetPassword() {
  function execute(props: ResetPasswordProps) {
    const {token, password} = props;
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(`Use-case(reset-password): Resetting password for ${token}`)
      );
      const passwordResetTokenRecord = yield* _(
        selectPasswordResetTokenRecord(token)
      );

      if (!passwordResetTokenRecord) {
        return yield* _(Effect.fail(new PasswordResetTokenNotFoundError()));
      }

      const userRecord = yield* _(
        selectUserRecord(passwordResetTokenRecord.user_id)
      );

      if (!userRecord) {
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      const passwordHash = yield* _(Password.hash(password));
      yield* _(updateUserRecord({id: userRecord.id, passwordHash}));
      yield* _(deletePasswordResetTokenRecord(token));

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
