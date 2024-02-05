import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import {User, userNameSchema} from '~/core/domain/user.server';
import {
  DatabaseError,
  InternalServerError,
  UserNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

const validationSchema = Schema.struct({
  name: userNameSchema,
});

export type EditUserProps = Schema.Schema.To<typeof validationSchema>;

export function editUser({pool, db}: {pool: PgPool; db: DB}) {
  function execute({
    props: {name},
    userId,
  }: {
    props: EditUserProps;
    userId: User['id'];
  }) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(`(edit-user): Editing user ${userId} with name ${name}`)
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
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      const user = yield* _(User.fromRecord(records[0]));
      return user;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () =>
          Effect.fail(new InternalServerError({reason: 'Database error'})),
        UserParseError: () =>
          Effect.fail(new InternalServerError({reason: 'Error parsing user'})),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
