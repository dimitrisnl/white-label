import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import {
  DatabaseError,
  IncorrectPasswordError,
  InternalServerError,
  UserNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

import {
  comparePasswords,
  hashPassword,
  passwordSchema,
} from '../domain/password.server';
import type {User} from '../domain/user.server';

const validationSchema = Schema.struct({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
});

export type ChangePasswordProps = Schema.Schema.To<typeof validationSchema>;

export function changePassword() {
  function execute(
    {newPassword, oldPassword}: ChangePasswordProps,
    userId: User['id']
  ) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(change-password): Changing password for user ${userId}`
        )
      );

      const userRecord = yield* _(
        Effect.tryPromise({
          try: () => db.selectOne('users', {id: userId}).run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (!userRecord) {
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      const isPasswordValid = yield* _(
        comparePasswords({
          plainText: oldPassword,
          hashValue: userRecord.password,
        })
      );

      if (!isPasswordValid) {
        return yield* _(Effect.fail(new IncorrectPasswordError()));
      }

      const hashedNewPassword = yield* _(hashPassword(newPassword));

      const records = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .update(
                'users',
                {password: hashedNewPassword, updated_at: db.sql`now()`},
                {id: userId}
              )
              .run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (records.length === 0 || !records[0]) {
        return new DatabaseError();
      }

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
