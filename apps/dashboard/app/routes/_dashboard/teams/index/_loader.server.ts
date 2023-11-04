import * as Effect from 'effect/Effect';

import {authenticateUser} from '~/modules/helpers.server.ts';
import {Ok, Redirect, ServerError} from '~/modules/responses.server.ts';
import {getUserMemberships} from '~/modules/use-cases/index.server.ts';
import {LoaderArgs, withLoader} from '~/modules/with-loader.server.ts';

export const loader = withLoader(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Loader(_dashboard/teams/index): Init'));
    const {request} = yield* _(LoaderArgs);
    const {id: userId} = yield* _(authenticateUser(request));

    const {memberships} = yield* _(getUserMemberships().execute(userId));

    return new Ok({data: {memberships}});
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

export type TeamsIndexLoaderData = typeof loader;
