import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import * as Password from '~/core/domain/password.server.ts';
import * as Uuid from '~/core/domain/uuid.server.ts';
import {
  DatabaseError,
  InternalServerError,
  PasswordResetTokenNotFoundError,
  UserNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server.ts';

const validationSchema = Schema.struct({
  password: Password.passwordSchema,
  token: Uuid.uuidSchema,
});

export type ResetPasswordProps = Schema.Schema.To<typeof validationSchema>;

export function resetPassword() {
  function execute({token, password}: ResetPasswordProps) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(`Use-case(reset-password): Resetting password for ${token}`)
      );
      const passwordResetTokenRecord = yield* _(
        Effect.tryPromise({
          try: () =>
            db.selectOne('password_reset_tokens', {id: token}).run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (!passwordResetTokenRecord) {
        return yield* _(Effect.fail(new PasswordResetTokenNotFoundError()));
      }

      const userRecord = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .selectOne('users', {id: passwordResetTokenRecord.user_id})
              .run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (!userRecord) {
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      const passwordHash = yield* _(Password.hash(password));
      const records = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .update('users', {password: passwordHash}, {id: userRecord.id})
              .run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (records.length === 0 || !records[0]) {
        return new DatabaseError();
      }

      yield* _(
        Effect.tryPromise({
          try: () => db.deletes('password_reset_tokens', {id: token}).run(pool),
          catch: () => new DatabaseError(),
        })
      );

      return null;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        PasswordHashError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
