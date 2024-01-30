import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import * as Email from '~/core/domain/email.server.ts';
import * as Password from '~/core/domain/password.server.ts';
import * as User from '~/core/domain/user.server.ts';
import {
  DatabaseError,
  InternalServerError,
  InvalidCredentialsError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

const validationSchema = Schema.struct({
  email: Email.emailSchema,
  password: Password.passwordSchema,
});

export type VerifyUserCredentialsProps = Schema.Schema.To<
  typeof validationSchema
>;

export function verifyUserCredentials() {
  function execute({email, password}: VerifyUserCredentialsProps) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(verify-user-credentials): Verifying credentials for ${email}`
        )
      );
      const userRecord = yield* _(
        Effect.tryPromise({
          try: () => db.selectOne('users', {email}).run(pool),
          catch: () => {
            return new DatabaseError();
          },
        })
      );

      if (!userRecord) {
        return yield* _(Effect.fail(new InvalidCredentialsError()));
      }

      const isPasswordValid = yield* _(
        Password.compare({
          plainText: password,
          hashValue: userRecord.password,
        })
      );

      if (!isPasswordValid) {
        return yield* _(Effect.fail(new InvalidCredentialsError()));
      }

      const user = yield* _(User.dbRecordToDomain(userRecord));

      return user;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
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
