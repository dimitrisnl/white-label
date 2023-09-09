import * as Effect from 'effect/Effect';

import {Ok, Redirect, ServerError} from '@/modules/responses.server';
import {requireUser} from '@/modules/session.server';
import {LoaderArgs, withLoader} from '@/modules/with-loader.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    const {request} = yield* _(LoaderArgs);
    const userData = yield* _(requireUser(request));
    return new Ok({data: userData});
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

export type SettingsLoaderData = typeof loader;
