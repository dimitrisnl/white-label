import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import {
  DatabaseError,
  InternalServerError,
  UserNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

import {emailSchema} from '../domain/email.server';
import {generateUUID} from '../domain/uuid.server';

const validationSchema = Schema.struct({
  email: emailSchema,
});

export type RequestPasswordResetProps = Schema.Schema.To<
  typeof validationSchema
>;

export function requestPasswordReset() {
  function execute({email}: RequestPasswordResetProps) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(request-password-reset): Requesting password reset for ${email}`
        )
      );
      const userRecord = yield* _(
        Effect.tryPromise({
          try: () => db.selectOne('users', {email}).run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (!userRecord) {
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      const passwordResetTokenId = yield* _(generateUUID());

      yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .insert('password_reset_tokens', {
                id: passwordResetTokenId,
                user_id: userRecord.id,
              })
              .run(pool),
          catch: () => new DatabaseError(),
        })
      );

      return {email: userRecord.email, passwordResetTokenId};
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        UUIDGenerationError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
