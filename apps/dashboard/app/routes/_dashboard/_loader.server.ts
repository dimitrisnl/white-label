import * as Effect from 'effect/Effect';

import {getCurrentUserDetails} from '~/modules/helpers.server.ts';
import {Ok, Redirect, ServerError} from '~/modules/responses.server.ts';
import {LoaderArgs, withLoader} from '~/modules/with-loader.server.ts';

export const loader = withLoader(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Loader(_dashboard/_layout): Init'));
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

export type CurrentUserLoaderData = typeof loader;
