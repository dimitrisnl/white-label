import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import * as Uuid from '~/core/domain/uuid.server.ts';
import {
  DatabaseError,
  InternalServerError,
  PasswordResetTokenNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server.ts';

const validationSchema = Schema.struct({
  token: Uuid.uuidSchema,
});

export type VerifyPasswordResetProps = Schema.Schema.To<
  typeof validationSchema
>;

function selectPasswordResetTokenRecord(token: string) {
  return Effect.tryPromise({
    try: () => db.selectOne('password_reset_tokens', {id: token}).run(pool),
    catch: () => new DatabaseError(),
  });
}

export function verifyPasswordReset() {
  function execute(props: VerifyPasswordResetProps) {
    const {token} = props;
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(`Use-case(verify-password-reset): Verifying token ${token}`)
      );
      const passwordResetTokenRecord = yield* _(
        selectPasswordResetTokenRecord(token)
      );

      if (!passwordResetTokenRecord) {
        return yield* _(Effect.fail(new PasswordResetTokenNotFoundError()));
      }

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
