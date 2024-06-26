import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import {emailSchema} from '~/core/domain/email.server';
import {generateUUID} from '~/core/domain/uuid.server';
import {
  DatabaseError,
  InternalServerError,
  UserNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

const validationSchema = Schema.Struct({
  email: emailSchema,
});

export type RequestPasswordResetProps = Schema.Schema.Type<
  typeof validationSchema
>;

export function requestPasswordReset({pool, db}: {pool: PgPool; db: DB}) {
  function execute({email}: RequestPasswordResetProps) {
    return Effect.gen(function* () {
      yield* Effect.log(
        `(request-password-reset): Requesting password reset for ${email}`
      );
      const userRecord = yield* Effect.tryPromise({
        try: () => db.selectOne('users', {email}).run(pool),
        catch: () => new DatabaseError(),
      });

      if (!userRecord) {
        return yield* Effect.fail(new UserNotFoundError());
      }

      const passwordResetTokenId = yield* generateUUID();

      yield* Effect.tryPromise({
        try: () =>
          db
            .insert('password_reset_tokens', {
              id: passwordResetTokenId,
              user_id: userRecord.id,
            })
            .run(pool),
        catch: () => new DatabaseError(),
      });

      return {email: userRecord.email, passwordResetTokenId};
    }).pipe(
      Effect.catchTags({
        DatabaseError: () =>
          Effect.fail(new InternalServerError({reason: 'Database error'})),
        UUIDGenerationError: () =>
          Effect.fail(
            new InternalServerError({reason: 'Error generating UUID'})
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
