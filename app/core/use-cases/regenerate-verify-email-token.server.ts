import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import type {User} from '~/core/domain/user.server';
import {generateUUID} from '~/core/domain/uuid.server';
import {
  DatabaseError,
  InternalServerError,
  UserEmailAlreadyVerifiedError,
  UserNotFoundError,
} from '~/core/lib/errors.server.ts';

export function regenerateVerifyEmailToken({pool, db}: {pool: PgPool; db: DB}) {
  function execute({userId}: {userId: User['id']}) {
    return Effect.gen(function* () {
      yield* Effect.log(`(regenerate-verify-email-token): For user ${userId}`);

      const userRecord = yield* Effect.tryPromise({
        try: () =>
          db
            .selectOne(
              'users',
              {id: userId},
              {columns: ['id', 'email', 'email_verified']}
            )
            .run(pool),
        catch: () => new DatabaseError(),
      });

      if (!userRecord) {
        return yield* Effect.fail(new UserNotFoundError());
      }

      if (userRecord.email_verified) {
        return yield* Effect.fail(new UserEmailAlreadyVerifiedError({userId}));
      }

      // Delete any existing verification tokens
      yield* Effect.tryPromise({
        try: () =>
          db.deletes('verify_email_tokens', {user_id: userId}).run(pool),
        catch: () => new DatabaseError(),
      });

      const verifyEmailTokenId = yield* generateUUID();

      yield* Effect.tryPromise({
        try: () =>
          db
            .insert('verify_email_tokens', {
              id: verifyEmailTokenId,
              user_id: userId,
            })
            .run(pool),
        catch: () => new DatabaseError(),
      });

      return {email: userRecord.email, verifyEmailTokenId};
    }).pipe(
      Effect.catchTags({
        DatabaseError: () =>
          Effect.fail(new InternalServerError({reason: 'Database error'})),
        UUIDGenerationError: () =>
          Effect.fail(
            new InternalServerError({reason: 'UUID generation error'})
          ),
      })
    );
  }

  return {
    execute,
  };
}
