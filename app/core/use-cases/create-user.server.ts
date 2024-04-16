import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';
import {isDatabaseError} from 'zapatos/db';

import {
  AccountAlreadyExistsError,
  DatabaseError,
  InternalServerError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

import type {DB, PgPool} from '../db/types';
import {emailSchema} from '../domain/email.server';
import {hashPassword, passwordSchema} from '../domain/password.server';
import {User, userNameSchema} from '../domain/user.server';
import {generateUUID} from '../domain/uuid.server';

const validationSchema = Schema.Struct({
  password: passwordSchema,
  email: emailSchema,
  name: userNameSchema,
});

export type CreateUserProps = Schema.Schema.Type<typeof validationSchema>;

export function createUser({pool, db}: {pool: PgPool; db: DB}) {
  function execute({email, name, password}: CreateUserProps) {
    return Effect.gen(function* (_) {
      yield* _(Effect.log(`(create-user): Creating user ${email}`));

      const passwordHash = yield* _(hashPassword(password));
      const userId = yield* _(generateUUID());

      const userRecord = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .insert('users', {
                id: userId,
                email: email.toLowerCase(),
                email_verified: false,
                password: passwordHash,
                name,
              })
              .run(pool),
          catch: (error) => {
            if (
              isDatabaseError(
                // @ts-expect-error
                error,
                'IntegrityConstraintViolation_UniqueViolation'
              )
            ) {
              return new AccountAlreadyExistsError({email});
            }

            return new DatabaseError();
          },
        })
      );

      const user = yield* _(User.fromRecord(userRecord));
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

      return {user, verifyEmailTokenId};
    }).pipe(
      Effect.catchTags({
        DatabaseError: () =>
          Effect.fail(new InternalServerError({reason: 'Database error'})),
        UserParseError: () =>
          Effect.fail(new InternalServerError({reason: 'User parse error'})),
        PasswordHashError: () =>
          Effect.fail(new InternalServerError({reason: 'Password hash error'})),
        UUIDGenerationError: () =>
          Effect.fail(
            new InternalServerError({reason: 'UUID generation error'})
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
