import * as Effect from 'effect/Effect';

import {getCurrentUserDetails} from '@/modules/helpers.server';
import {decideNextTeamRedirect} from '@/modules/navigation.server';
import {Redirect, ServerError} from '@/modules/responses.server';
import {LoaderArgs, withLoader} from '@/modules/with-loader.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    const {request} = yield* _(LoaderArgs);
    const {memberships} = yield* _(getCurrentUserDetails(request));

    return decideNextTeamRedirect(memberships, request);
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

export type IndexLoaderData = typeof loader;
