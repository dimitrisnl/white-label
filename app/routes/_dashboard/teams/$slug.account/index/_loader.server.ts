import * as Effect from 'effect/Effect';

import {authenticateUser} from '~/core/lib/helpers.server';
import {Ok, Redirect, ServerError} from '~/core/lib/responses.server';
import {LoaderArgs, withLoader} from '~/core/lib/with-loader.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Loader(_dashboard/account/index): Init'));
    const {request} = yield* _(LoaderArgs);
    const user = yield* _(authenticateUser(request));

    return new Ok({data: {user}});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError({})),
      SessionNotFoundError: () =>
        LoaderArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
    })
  )
);

export type UserDetailsLoaderData = typeof loader;