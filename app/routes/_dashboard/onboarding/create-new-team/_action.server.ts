import * as Effect from 'effect/Effect';

import {authenticateUser, parseFormData} from '~/core/lib/helpers.server';
import {BadRequest, Redirect, ServerError} from '~/core/lib/responses.server';
import {ActionArgs, withAction} from '~/core/lib/with-action.server';
import {createOrg} from '~/core/use-cases/create-org.server';

export const action = withAction(
  Effect.gen(function* (_) {
    const {request} = yield* _(ActionArgs);
    const userId = yield* _(authenticateUser(request));

    const {validate, execute} = createOrg();
    const data = yield* _(parseFormData(request));
    const props = yield* _(validate(data));

    const org = yield* _(execute({props, userId}));

    return new Redirect({to: `/teams/${org.slug}`});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError({})),
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
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

export type CreateNewTeamAction = typeof action;
