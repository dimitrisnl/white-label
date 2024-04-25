import * as Effect from 'effect/Effect';

import {pool} from '~/core/db/pool.server';
import {db} from '~/core/db/schema.server';
import {authenticateUser, parseFormData} from '~/core/lib/helpers.server';
import {
  BadRequest,
  Ok,
  Redirect,
  ServerError,
} from '~/core/lib/responses.server';
import {ActionArgs, withAction} from '~/core/lib/with-action.server';
import {changePassword} from '~/core/use-cases/change-password.server';

export const action = withAction(
  Effect.gen(function* () {
    const {request} = yield* ActionArgs;
    const userId = yield* authenticateUser(request);
    const {validate, execute} = changePassword({db, pool});
    const data = yield* parseFormData(request);
    const props = yield* validate(data);

    yield* execute({props, userId});

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
      IncorrectPasswordError: () =>
        Effect.fail(
          new BadRequest({errors: ['The provided password is incorrect']})
        ),
      InternalServerError: () => Effect.fail(new ServerError()),
      UserNotFoundError: () =>
        ActionArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
      SessionNotFoundError: () =>
        ActionArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
    })
  )
);

export type ChangePasswordAction = typeof action;
