import * as Effect from 'effect/Effect';

import {authenticateUser, parseFormData} from '~/core/lib/helpers.server';
import {
  BadRequest,
  Ok,
  Redirect,
  ServerError,
} from '~/core/lib/responses.server';
import {ActionArgs, withAction} from '~/core/lib/with-action.server';
import {editUser} from '~/core/use-cases/edit-user.server';

export const action = withAction(
  Effect.gen(function* (_) {
    const {request} = yield* _(ActionArgs);
    const userId = yield* _(authenticateUser(request));

    const {validate, execute} = editUser();
    const data = yield* _(parseFormData(request));
    const props = yield* _(validate(data));

    yield* _(execute({props, userId}));

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
      InternalServerError: () => Effect.fail(new ServerError()),
      UserNotFoundError: () =>
        Effect.fail(new BadRequest({errors: ['Something went wrong']})),
      SessionNotFoundError: () =>
        ActionArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
    })
  )
);

export type EditUserAction = typeof action;
