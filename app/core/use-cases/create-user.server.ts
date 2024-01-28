import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import {UNIQUE_CONSTRAINT} from '~/core/db/pg-error.ts';
import * as Email from '~/core/domain/email.server';
import * as Password from '~/core/domain/password.server.ts';
import * as User from '~/core/domain/user.server.ts';
import * as Uuid from '~/core/domain/uuid.server.ts';
import {
  AccountAlreadyExistsError,
  DatabaseError,
  InternalServerError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

const validationSchema = Schema.struct({
  password: Password.passwordSchema,
  email: Email.emailSchema,
  name: User.userNameSchema,
});

export type CreateUserProps = Schema.Schema.To<typeof validationSchema>;

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
          email: email.toLowerCase(),
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

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}