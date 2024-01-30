import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';
import {isDatabaseError} from 'zapatos/db';

import {db, pool} from '~/core/db/db.server.ts';
import {
  AccountAlreadyExistsError,
  DatabaseError,
  InternalServerError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

import {emailSchema} from '../domain/email.server';
import {hashPassword, passwordSchema} from '../domain/password.server';
import {User, userNameSchema} from '../domain/user.server';
import {generateUUID} from '../domain/uuid.server';

const validationSchema = Schema.struct({
  password: passwordSchema,
  email: emailSchema,
  name: userNameSchema,
});

export type CreateUserProps = Schema.Schema.To<typeof validationSchema>;

export function createUser() {
  function execute({email, name, password}: CreateUserProps) {
    return Effect.gen(function* (_) {
      yield* _(Effect.log(`Use-case(create-user): Creating user ${email}`));

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
              return new AccountAlreadyExistsError();
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
        DatabaseError: () => Effect.fail(new InternalServerError()),
        UserParseError: () => Effect.fail(new InternalServerError()),
        PasswordHashError: () => Effect.fail(new InternalServerError()),
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
