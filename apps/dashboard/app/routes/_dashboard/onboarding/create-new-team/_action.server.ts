import * as Effect from 'effect/Effect';

import {getCurrentUserId, parseFormData} from '@/modules/helpers.server.ts';
import {BadRequest, Redirect, ServerError} from '@/modules/responses.server.ts';
import {createOrg} from '@/modules/use-cases/index.server.ts';
import {ActionArgs, withAction} from '@/modules/with-action.server.ts';

export const action = withAction(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Action(_dashboard/onboarding/create-new-team): Init'));
    const {request} = yield* _(ActionArgs);
    const userId = yield* _(getCurrentUserId(request));

    const {validate, execute} = createOrg();
    const data = yield* _(parseFormData(request));
    const props = yield* _(validate(data));

    const org = yield* _(execute(props, userId));

    return new Redirect({
      to: `/teams/${org.slug}`,
      init: request,
    });
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError({})),
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
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
