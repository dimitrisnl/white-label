import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import {
  DatabaseError,
  InternalServerError,
  UserNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

import {User, userNameSchema} from '../domain/user.server';

const validationSchema = Schema.struct({
  name: userNameSchema,
});

export type EditUserProps = Schema.Schema.To<typeof validationSchema>;

export function editUser() {
  function execute({name}: EditUserProps, userId: User['id']) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(edit-user): Editing user ${userId} with name ${name}`
        )
      );
      const records = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .update('users', {name, updated_at: db.sql`now()`}, {id: userId})
              .run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (records.length === 0 || !records[0]) {
        yield* _(
          Effect.logError(`
          Use-case(edit-user): User ${userId} not found`)
        );
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      const user = yield* _(User.fromRecord(records[0]));
      return user;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        UserParseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
