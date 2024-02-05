import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import {
  DatabaseError,
  InternalServerError,
  UserEmailAlreadyVerifiedError,
  UserNotFoundError,
} from '~/core/lib/errors.server.ts';

import type {User} from '../domain/user.server';
import {generateUUID} from '../domain/uuid.server';

export function regenerateVerifyEmailToken() {
  function execute({userId}: {userId: User['id']}) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(`(regenerate-verify-email-token): For user ${userId}`)
      );

      const userRecord = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .selectOne(
                'users',
                {id: userId},
                {columns: ['id', 'email', 'email_verified']}
              )
              .run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (!userRecord) {
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      if (userRecord.email_verified) {
        return yield* _(
          Effect.fail(new UserEmailAlreadyVerifiedError({userId}))
        );
      }

      // Delete any existing verification tokens
      yield* _(
        Effect.tryPromise({
          try: () =>
            db.deletes('verify_email_tokens', {user_id: userId}).run(pool),
          catch: () => new DatabaseError(),
        })
      );

      const verifyEmailTokenId = yield* _(generateUUID());

      yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .insert('verify_email_tokens', {
                id: verifyEmailTokenId,
                user_id: userId,
              })
              .run(pool),
          catch: () => new DatabaseError(),
        })
      );

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
