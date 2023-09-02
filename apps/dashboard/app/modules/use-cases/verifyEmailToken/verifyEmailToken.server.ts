import * as Effect from 'effect/Effect';

import {db, pool} from '@/database/db.server';
import {
  DatabaseError,
  InternalServerError,
  UserNotFoundError,
  VerifyEmailTokenNotFoundError,
} from '@/modules/errors.server';

import type {VerifyEmailProps} from './validation.server';
import {validate} from './validation.server';

function selectVerifyEmailTokenRecord(token: string) {
  return Effect.tryPromise({
    try: () => db.selectOne('verify_email_tokens', {id: token}).run(pool),
    catch: () => new DatabaseError(),
  });
}

function selectUserRecord(id: string) {
  return Effect.tryPromise({
    try: () => db.selectOne('users', {id}).run(pool),
    catch: () => new DatabaseError(),
  });
}

function updateUserRecord({
  id,
  emailVerified,
}: {
  id: string;
  emailVerified: boolean;
}) {
  return Effect.tryPromise({
    try: () =>
      db.update('users', {email_verified: emailVerified}, {id}).run(pool),
    catch: () => new DatabaseError(),
  });
}

function deleteVerifyEmailTokenRecord(token: string) {
  return Effect.tryPromise({
    try: () => db.deletes('verify_email_tokens', {id: token}).run(pool),
    catch: () => new DatabaseError(),
  });
}

export function verifyEmailToken() {
  function execute(props: VerifyEmailProps) {
    const {token} = props;
    return Effect.gen(function* (_) {
      const verifyEmailTokenRecord = yield* _(
        selectVerifyEmailTokenRecord(token)
      );

      if (!verifyEmailTokenRecord) {
        return yield* _(Effect.fail(new VerifyEmailTokenNotFoundError()));
      }

      const userRecord = yield* _(
        selectUserRecord(verifyEmailTokenRecord.user_id)
      );

      if (!userRecord) {
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      yield* _(
        updateUserRecord({
          id: verifyEmailTokenRecord.user_id,
          emailVerified: true,
        })
      );

      yield* _(deleteVerifyEmailTokenRecord(token));

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
