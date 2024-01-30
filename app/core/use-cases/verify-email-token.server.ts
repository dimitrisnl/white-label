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

function deleteVerifyEmailTokenRecord(token: string) {
  return Effect.tryPromise({
    try: () => db.deletes('verify_email_tokens', {id: token}).run(pool),
    catch: () => new DatabaseError(),
  });
}

export function verifyEmailToken() {
  function execute({token}: VerifyEmailProps) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(`Use-case(verify-email-token): Verifying token ${token}`)
      );

      const verifyEmailTokenRecord = yield* _(
        Effect.tryPromise({
          try: () => db.selectOne('verify_email_tokens', {id: token}).run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (!verifyEmailTokenRecord) {
        return yield* _(Effect.fail(new VerifyEmailTokenNotFoundError()));
      }

      const userRecord = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .selectOne('users', {id: verifyEmailTokenRecord.user_id})
              .run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (!userRecord) {
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      const records = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .update('users', {email_verified: true}, {id: userRecord.id})
              .run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (records.length === 0 || !records[0]) {
        return new DatabaseError();
      }

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
