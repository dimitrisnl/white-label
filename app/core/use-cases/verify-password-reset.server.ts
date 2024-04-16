import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import {uuidSchema} from '~/core/domain/uuid.server';
import {
  DatabaseError,
  InternalServerError,
  PasswordResetTokenNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server.ts';

const validationSchema = Schema.Struct({
  token: uuidSchema,
});

export type VerifyPasswordResetProps = Schema.Schema.Type<
  typeof validationSchema
>;

export function verifyPasswordReset({pool, db}: {pool: PgPool; db: DB}) {
  function execute({token}: VerifyPasswordResetProps) {
    return Effect.gen(function* (_) {
      yield* _(Effect.log(`(verify-password-reset): Verifying token ${token}`));
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

      return null;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () =>
          Effect.fail(new InternalServerError({reason: 'Database error'})),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
