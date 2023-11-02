import * as Effect from 'effect/Effect';

import {db, pool} from '~/database/db.server.ts';
import {User, Uuid} from '~/modules/domain/index.server.ts';
import {
  DatabaseError,
  InternalServerError,
  UserNotFoundError,
} from '~/modules/errors.server.ts';

import type {RequestPasswordResetProps} from './validation.server.ts';
import {validate} from './validation.server.ts';

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
      yield* _(
        Effect.log(
          `Use-case(request-password-reset): Requesting password reset for ${email}`
        )
      );
      const userRecord = yield* _(selectUserRecord(email));

      if (!userRecord) {
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      const user = yield* _(User.dbRecordToDomain(userRecord));

      const passwordResetTokenId = yield* _(Uuid.generate());
      yield* _(createPasswordResetToken(passwordResetTokenId, user.id));

      return {email: user.email, passwordResetTokenId};
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
