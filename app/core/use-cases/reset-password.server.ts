import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import {hashPassword, passwordSchema} from '~/core/domain/password.server';
import {uuidSchema} from '~/core/domain/uuid.server';
import {
  DatabaseError,
  InternalServerError,
  PasswordResetTokenNotFoundError,
  UserNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server.ts';

const validationSchema = Schema.Struct({
  password: passwordSchema,
  token: uuidSchema,
});

export type ResetPasswordProps = Schema.Schema.Type<typeof validationSchema>;

export function resetPassword({pool, db}: {pool: PgPool; db: DB}) {
  function execute({token, password}: ResetPasswordProps) {
    return Effect.gen(function* () {
      yield* Effect.log(`(reset-password): Resetting password for ${token}`);
      const passwordResetTokenRecord = yield* Effect.tryPromise({
        try: () => db.selectOne('password_reset_tokens', {id: token}).run(pool),
        catch: () => new DatabaseError(),
      });

      if (!passwordResetTokenRecord) {
        return yield* Effect.fail(new PasswordResetTokenNotFoundError());
      }

      const userRecord = yield* Effect.tryPromise({
        try: () =>
          db
            .selectOne('users', {id: passwordResetTokenRecord.user_id})
            .run(pool),
        catch: () => new DatabaseError(),
      });

      if (!userRecord) {
        return yield* Effect.fail(new UserNotFoundError());
      }

      const passwordHash = yield* hashPassword(password);
      const records = yield* Effect.tryPromise({
        try: () =>
          db
            .update(
              'users',
              {password: passwordHash, updated_at: db.sql`now()`},
              {id: userRecord.id}
            )
            .run(pool),
        catch: () => new DatabaseError(),
      });

      if (records.length === 0 || !records[0]) {
        return new DatabaseError();
      }

      yield* Effect.tryPromise({
        try: () => db.deletes('password_reset_tokens', {id: token}).run(pool),
        catch: () => new DatabaseError(),
      });

      return null;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () =>
          Effect.fail(new InternalServerError({reason: 'Database error'})),
        PasswordHashError: () =>
          Effect.fail(
            new InternalServerError({reason: 'Error hashing password'})
          ),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
