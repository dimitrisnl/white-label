import * as Effect from 'effect/Effect';

import {db, pool} from '@/database/db.server.ts';
import {Password, User} from '@/modules/domain/index.server.ts';
import {
  DatabaseError,
  InternalServerError,
  InvalidCredentialsError,
} from '@/modules/errors.server.ts';

import type {VerifyUserCredentialsProps} from './validation.server.ts';
import {validate} from './validation.server.ts';

function selectUserRecord(email: User.User['email']) {
  return Effect.tryPromise({
    try: () => db.selectOne('users', {email}).run(pool),
    catch: () => {
      return new DatabaseError();
    },
  });
}

export function verifyUserCredentials() {
  function execute(props: VerifyUserCredentialsProps) {
    const {email, password} = props;
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(verify-user-credentials): Verifying credentials for ${email}`
        )
      );
      const userRecord = yield* _(selectUserRecord(email));

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

  return {
    execute,
    validate,
  };
}
