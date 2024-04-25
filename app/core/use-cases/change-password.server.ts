import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {
  DatabaseError,
  IncorrectPasswordError,
  InternalServerError,
  UserNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

import type {DB, PgPool} from '../db/types';
import {
  comparePasswords,
  hashPassword,
  passwordSchema,
} from '../domain/password.server';
import type {User} from '../domain/user.server';

const validationSchema = Schema.Struct({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
});

export type ChangePasswordProps = Schema.Schema.Type<typeof validationSchema>;

export function changePassword({pool, db}: {pool: PgPool; db: DB}) {
  function execute({
    props: {oldPassword, newPassword},
    userId,
  }: {
    props: ChangePasswordProps;
    userId: User['id'];
  }) {
    return Effect.gen(function* () {
      yield* Effect.log(
        `(change-password): Changing password for user ${userId}`
      );

      const userRecord = yield* Effect.tryPromise({
        try: () => db.selectOne('users', {id: userId}).run(pool),
        catch: () => new DatabaseError(),
      });

      if (!userRecord) {
        return yield* Effect.fail(new UserNotFoundError());
      }

      const isPasswordValid = yield* comparePasswords({
        plainText: oldPassword,
        hashValue: userRecord.password,
      });

      if (!isPasswordValid) {
        return yield* Effect.fail(new IncorrectPasswordError());
      }

      const hashedNewPassword = yield* hashPassword(newPassword);

      const records = yield* Effect.tryPromise({
        try: () =>
          db
            .update(
              'users',
              {password: hashedNewPassword, updated_at: db.sql`now()`},
              {id: userId}
            )
            .run(pool),
        catch: () => new DatabaseError(),
      });

      if (records.length === 0 || !records[0]) {
        return new DatabaseError();
      }

      return null;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () =>
          Effect.fail(new InternalServerError({reason: 'Database error'})),
        PasswordHashError: () =>
          Effect.fail(new InternalServerError({reason: 'Password hash error'})),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
