import * as Effect from 'effect/Effect';

import {getCurrentUserId} from '~/modules/helpers.server.ts';
import {decideNextTeamRedirect} from '~/modules/navigation.server';
import {Redirect, ServerError} from '~/modules/responses.server.ts';
import {getUserMemberships} from '~/modules/use-cases/index.server';
import {LoaderArgs, withLoader} from '~/modules/with-loader.server.ts';

export const loader = withLoader(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Loader(_dashboard/index): Init'));
    const {request} = yield* _(LoaderArgs);
    const userId = yield* _(getCurrentUserId(request));

    // todo: replace with query that gets the last accessed team
    const {memberships} = yield* _(getUserMemberships().execute(userId));
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
