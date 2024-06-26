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

const validationSchema = Schema.Struct({
  email: emailSchema,
  password: passwordSchema,
});

export type VerifyUserCredentialsProps = Schema.Schema.Type<
  typeof validationSchema
>;

export function verifyUserCredentials({pool, db}: {pool: PgPool; db: DB}) {
  function execute({email, password}: VerifyUserCredentialsProps) {
    return Effect.gen(function* () {
      yield* Effect.log(
        `(verify-user-credentials): Verifying credentials for ${email}`
      );

      const userRecord = yield* Effect.tryPromise({
        try: () => db.selectOne('users', {email}).run(pool),
        catch: () => new DatabaseError(),
      });

      if (!userRecord) {
        return yield* Effect.fail(
          new InvalidCredentialsError({email, reason: 'User not found'})
        );
      }

      const isPasswordValid = yield* comparePasswords({
        plainText: password,
        hashValue: userRecord.password,
      });

      if (!isPasswordValid) {
        return yield* Effect.fail(
          new InvalidCredentialsError({email, reason: 'Invalid password'})
        );
      }

      const user = yield* User.fromRecord(userRecord);

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
