import * as Effect from 'effect/Effect';

import {getCurrentUserId, parseFormData} from '@/modules/helpers.server';
import {
  BadRequest,
  Ok,
  Redirect,
  ServerError,
} from '@/modules/responses.server';
import {changePassword} from '@/modules/use-cases/index.server';
import {ActionArgs, withAction} from '@/modules/with-action.server';

export const action = withAction(
  Effect.gen(function* (_) {
    const {request} = yield* _(ActionArgs);
    const userId = yield* _(getCurrentUserId(request));

    const {validate, execute} = changePassword();
    const data = yield* _(parseFormData(request));
    const props = yield* _(validate(data));

    yield* _(execute(props, userId));

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      ValidationError: () =>
        Effect.fail(new BadRequest({errors: ['Validation Error']})),
      UserNotFoundError: () =>
        Effect.fail(new BadRequest({errors: ['User not found']})),
      IncorrectPasswordError: () =>
        Effect.fail(new BadRequest({errors: ['Incorrect password']})),
      InternalServerError: () => Effect.fail(new ServerError({})),
      SessionNotFoundError: () =>
        ActionArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
    })
  )
);

export type Action = typeof action;
