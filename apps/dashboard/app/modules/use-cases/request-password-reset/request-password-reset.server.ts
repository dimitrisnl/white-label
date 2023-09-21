import * as Effect from 'effect/Effect';

import {db, pool} from '@/database/db.server';
import {User, Uuid} from '@/modules/domain/index.server';
import {
  DatabaseError,
  InternalServerError,
  UserNotFoundError,
} from '@/modules/errors.server';

import type {RequestPasswordResetProps} from './validation.server';
import {validate} from './validation.server';

function selectUserRecord(email: User.User['email']) {
  return Effect.tryPromise({
    try: () =>
      db
        .selectOne('users', {
          email,
        })
        .run(pool),
    catch: () => new DatabaseError(),
  });
}

function createPasswordResetToken(tokenId: Uuid.Uuid, userId: User.User['id']) {
  return Effect.tryPromise({
    try: () =>
      db
        .insert('password_reset_tokens', {
          id: tokenId,
          user_id: userId,
        })
        .run(pool),
    catch: () => new DatabaseError(),
  });
}

export function requestPasswordReset() {
  function execute(props: RequestPasswordResetProps) {
    const {email} = props;
    return Effect.gen(function* (_) {
      const userRecord = yield* _(selectUserRecord(email));

      if (!userRecord) {
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      const user = yield* _(User.dbRecordToDomain(userRecord));

      const resetPasswordTokenId = yield* _(Uuid.generate());
      yield* _(createPasswordResetToken(resetPasswordTokenId, user.id));

      return {email: user.email, resetPasswordTokenId};
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
        UUIDGenerationError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {
    execute,
    validate,
  };
}
