import * as Effect from 'effect/Effect';

import {getCurrentUserId, parseFormData} from '@/modules/helpers.server.ts';
import {
  BadRequest,
  Ok,
  Redirect,
  ServerError,
} from '@/modules/responses.server.ts';
import {editUser} from '@/modules/use-cases/index.server.ts';
import {ActionArgs, withAction} from '@/modules/with-action.server.ts';

export const action = withAction(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Action(_dashboard/account/index): Init'));
    const {request} = yield* _(ActionArgs);
    const userId = yield* _(getCurrentUserId(request));

    const {validate, execute} = editUser();
    const data = yield* _(parseFormData(request));
    const props = yield* _(validate(data));

    yield* _(execute(props, userId));

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
      InternalServerError: () => Effect.fail(new ServerError({})),
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
