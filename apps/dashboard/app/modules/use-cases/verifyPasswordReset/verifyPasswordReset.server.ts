import * as Effect from 'effect/Effect';

import {db, pool} from '@/database/db.server';
import {
  DatabaseError,
  InternalServerError,
  PasswordResetTokenNotFoundError,
} from '@/modules/errors.server';

import type {VerifyPasswordResetProps} from './validation.server';
import {validate} from './validation.server';

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
