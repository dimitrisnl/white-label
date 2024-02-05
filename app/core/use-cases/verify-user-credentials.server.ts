import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import {emailSchema} from '~/core/domain/email.server';
import {comparePasswords, passwordSchema} from '~/core/domain/password.server';
import {User} from '~/core/domain/user.server';
import {
  DatabaseError,
  InternalServerError,
  InvalidCredentialsError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

const validationSchema = Schema.struct({
  email: emailSchema,
  password: passwordSchema,
});

export type VerifyUserCredentialsProps = Schema.Schema.To<
  typeof validationSchema
>;

export function verifyUserCredentials({pool, db}: {pool: PgPool; db: DB}) {
  function execute({email, password}: VerifyUserCredentialsProps) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `(verify-user-credentials): Verifying credentials for ${email}`
        )
      );

      const userRecord = yield* _(
        Effect.tryPromise({
          try: () => db.selectOne('users', {email}).run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (!userRecord) {
        return yield* _(
          Effect.fail(
            new InvalidCredentialsError({email, reason: 'User not found'})
          )
        );
      }

      const isPasswordValid = yield* _(
        comparePasswords({
          plainText: password,
          hashValue: userRecord.password,
        })
      );

      if (!isPasswordValid) {
        return yield* _(
          Effect.fail(
            new InvalidCredentialsError({email, reason: 'Invalid password'})
          )
        );
      }

      const user = yield* _(User.fromRecord(userRecord));

      return user;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () =>
          Effect.fail(new InternalServerError({reason: 'Database error'})),
        UserParseError: () =>
          Effect.fail(new InternalServerError({reason: 'Error parsing user'})),
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
