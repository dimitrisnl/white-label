import * as Effect from 'effect/Effect';

import {pool} from '~/core/db/pool.server';
import {db} from '~/core/db/schema.server';
import {authenticateUser, parseFormData} from '~/core/lib/helpers.server';
import {BadRequest, Redirect, ServerError} from '~/core/lib/responses.server';
import {ActionArgs, withAction} from '~/core/lib/with-action.server';
import {createOrg} from '~/core/use-cases/create-org.server';

export const action = withAction(
  Effect.gen(function* () {
    const {request} = yield* ActionArgs;
    const userId = yield* authenticateUser(request);

    const {validate, execute} = createOrg({db, pool});
    const data = yield* parseFormData(request);
    const props = yield* validate(data);

    const org = yield* execute({props, userId});

    return new Redirect({to: `/teams/${org.slug}`});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError()),
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
