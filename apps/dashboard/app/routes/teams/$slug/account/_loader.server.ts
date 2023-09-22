import * as Effect from 'effect/Effect';

import {getCurrentUserDetails} from '@/modules/helpers.server';
import {Ok, Redirect, ServerError} from '@/modules/responses.server';
import {LoaderArgs, withLoader} from '@/modules/with-loader.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    const {request} = yield* _(LoaderArgs);

    const currentUser = yield* _(getCurrentUserDetails(request));

    return new Ok({data: currentUser});
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

export type AccountLoaderData = typeof loader;
