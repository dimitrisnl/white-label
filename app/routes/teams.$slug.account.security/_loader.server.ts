import * as Effect from 'effect/Effect';

import {authenticateUser} from '~/core/lib/helpers.server';
import {Ok, Redirect} from '~/core/lib/responses.server';
import {LoaderArgs, withLoader} from '~/core/lib/with-loader.server';

export const loader = withLoader(
  Effect.gen(function* () {
    const {request} = yield* LoaderArgs;
    yield* authenticateUser(request);

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      SessionNotFoundError: () =>
        LoaderArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
    })
  )
);

export type UserInvitationsLoaderData = typeof loader;
