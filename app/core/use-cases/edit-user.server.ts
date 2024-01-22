import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import * as User from '~/core/domain/user.server.ts';
import {
  DatabaseError,
  InternalServerError,
  UserNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

const validationSchema = Schema.struct({
  name: User.userNameSchema,
});

export type EditUserProps = Schema.Schema.To<typeof validationSchema>;

function updateUserRecord({
  id,
  name,
}: {
  id: User.User['id'];
  name: User.User['name'];
}) {
  return Effect.tryPromise({
    try: () => db.update('users', {name}, {id}).run(pool),
    catch: () => new DatabaseError(),
  });
}

export function editUser() {
  function execute(props: EditUserProps, userId: User.User['id']) {
    const {name} = props;
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(edit-user): Editing user ${userId} with name ${name}`
        )
      );
      const [userRecord] = yield* _(updateUserRecord({id: userId, name}));

      if (!userRecord) {
        yield* _(
          Effect.logError(`
          Use-case(edit-user): User ${userId} not found`)
        );
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      const user = yield* _(User.dbRecordToDomain(userRecord));
      return user;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
