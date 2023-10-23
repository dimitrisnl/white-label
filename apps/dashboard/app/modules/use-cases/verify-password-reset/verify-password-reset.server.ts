import * as Effect from 'effect/Effect';

import {db, pool} from '@/database/db.server.ts';
import {
  DatabaseError,
  InternalServerError,
  PasswordResetTokenNotFoundError,
} from '@/modules/errors.server.ts';

import type {VerifyPasswordResetProps} from './validation.server.ts';
import {validate} from './validation.server.ts';

function selectPasswordResetTokenRecord(token: string) {
  return Effect.tryPromise({
    try: () => db.selectOne('password_reset_tokens', {id: token}).run(pool),
    catch: () => new DatabaseError(),
  });
}

export function verifyPasswordReset() {
  function execute(props: VerifyPasswordResetProps) {
    const {token} = props;
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(`Use-case(verify-password-reset): Verifying token ${token}`)
      );
      const passwordResetTokenRecord = yield* _(
        selectPasswordResetTokenRecord(token)
      );

      if (!passwordResetTokenRecord) {
        return yield* _(Effect.fail(new PasswordResetTokenNotFoundError()));
      }

      return null;
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
