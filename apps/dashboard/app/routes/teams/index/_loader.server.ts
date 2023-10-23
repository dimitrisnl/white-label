import * as Effect from 'effect/Effect';

import {getCurrentUserDetails} from '@/modules/helpers.server.ts';
import {decideNextTeamRedirect} from '@/modules/navigation.server.ts';
import {Redirect, ServerError} from '@/modules/responses.server.ts';
import {LoaderArgs, withLoader} from '@/modules/with-loader.server.ts';

export const loader = withLoader(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Loader(teams/index): Init'));
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
