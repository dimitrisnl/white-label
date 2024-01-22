import * as Effect from 'effect/Effect';

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
  Effect.gen(function* (_) {
    yield* _(Effect.log('Action(_dashboard/account/security): Init'));
    const {request} = yield* _(ActionArgs);
    const {id: userId} = yield* _(authenticateUser(request));

    const {validate, execute} = changePassword();
    const data = yield* _(parseFormData(request));
    const props = yield* _(validate(data));

    yield* _(execute(props, userId));

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
      IncorrectPasswordError: () =>
        Effect.fail(
          new BadRequest({errors: ['The provided password is incorrect']})
        ),
      InternalServerError: () => Effect.fail(new ServerError({})),
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
