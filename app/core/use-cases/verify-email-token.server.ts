import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import * as Uuid from '~/core/domain/uuid.server.ts';
import {
  DatabaseError,
  InternalServerError,
  UserNotFoundError,
  VerifyEmailTokenNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server.ts';

const validationSchema = Schema.struct({
  token: Uuid.uuidSchema,
});

export type VerifyEmailProps = Schema.Schema.To<typeof validationSchema>;

function selectVerifyEmailTokenRecord(token: string) {
  return Effect.tryPromise({
    try: () => db.selectOne('verify_email_tokens', {id: token}).run(pool),
    catch: () => new DatabaseError(),
  });
}

function selectUserRecord(id: string) {
  return Effect.tryPromise({
    try: () => db.selectOne('users', {id}).run(pool),
    catch: () => new DatabaseError(),
  });
}

function updateUserRecord({
  id,
  emailVerified,
}: {
  id: string;
  emailVerified: boolean;
}) {
  return Effect.tryPromise({
    try: () =>
      db.update('users', {email_verified: emailVerified}, {id}).run(pool),
    catch: () => new DatabaseError(),
  });
}

function deleteVerifyEmailTokenRecord(token: string) {
  return Effect.tryPromise({
    try: () => db.deletes('verify_email_tokens', {id: token}).run(pool),
    catch: () => new DatabaseError(),
  });
}

export function verifyEmailToken() {
  function execute(props: VerifyEmailProps) {
    const {token} = props;
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(`Use-case(verify-email-token): Verifying token ${token}`)
      );
      const verifyEmailTokenRecord = yield* _(
        selectVerifyEmailTokenRecord(token)
      );

      if (!verifyEmailTokenRecord) {
        return yield* _(Effect.fail(new VerifyEmailTokenNotFoundError()));
      }

      const userRecord = yield* _(
        selectUserRecord(verifyEmailTokenRecord.user_id)
      );

      if (!userRecord) {
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      yield* _(
        updateUserRecord({
          id: verifyEmailTokenRecord.user_id,
          emailVerified: true,
        })
      );

      yield* _(deleteVerifyEmailTokenRecord(token));

      return null;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
