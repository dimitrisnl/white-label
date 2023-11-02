import * as Effect from 'effect/Effect';

import {db, pool} from '~/database/db.server.ts';
import {UNIQUE_CONSTRAINT} from '~/database/pg-error.ts';
import {Password, User, Uuid} from '~/modules/domain/index.server.ts';
import {
  AccountAlreadyExistsError,
  DatabaseError,
  InternalServerError,
} from '~/modules/errors.server.ts';

import type {CreateUserProps} from './validation.server.ts';
import {validate} from './validation.server.ts';

function createUserRecord({
  email,
  name,
  passwordHash,
  id,
}: {
  email: User.User['email'];
  name: User.User['name'];
  passwordHash: Password.Password;
  id: Uuid.Uuid;
}) {
  return Effect.tryPromise({
    try: () =>
      db
        .insert('users', {
          id,
          email,
          email_verified: false,
          password: passwordHash,
          name,
        })
        .run(pool),
    catch: (error) => {
      // todo: fix
      // @ts-expect-error
      if (error && error.code == UNIQUE_CONSTRAINT) {
        return new AccountAlreadyExistsError();
      }

      return new DatabaseError();
    },
  });
}

function createVerifyEmailToken(tokenId: Uuid.Uuid, userId: User.User['id']) {
  return Effect.tryPromise({
    try: () =>
      db
        .insert('verify_email_tokens', {
          id: tokenId,
          user_id: userId,
        })
        .run(pool),
    catch: () => new DatabaseError(),
  });
}

export function createUser() {
  function execute(props: CreateUserProps) {
    const {email, name, password} = props;
    return Effect.gen(function* (_) {
      yield* _(Effect.log(`Use-case(create-user): Creating user ${email}`));
      const passwordHash = yield* _(Password.hash(password));
      const userId = yield* _(Uuid.generate());
      const userRecord = yield* _(
        createUserRecord({email, name, passwordHash, id: userId})
      );
      const user = yield* _(User.dbRecordToDomain(userRecord));

      const verifyEmailTokenId = yield* _(Uuid.generate());
      yield* _(createVerifyEmailToken(verifyEmailTokenId, user.id));

      return {user, verifyEmailTokenId};
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
        PasswordHashError: () => Effect.fail(new InternalServerError()),
        UUIDGenerationError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {
    execute,
    validate,
  };
}
