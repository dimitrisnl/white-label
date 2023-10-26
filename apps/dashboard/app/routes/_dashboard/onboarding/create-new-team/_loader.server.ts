import * as Effect from 'effect/Effect';

import {getCurrentUserId} from '@/modules/helpers.server.ts';
import {Ok, Redirect, ServerError} from '@/modules/responses.server.ts';
import {LoaderArgs, withLoader} from '@/modules/with-loader.server.ts';

export const loader = withLoader(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Loader(_dashboard/onboarding/create-new-team): Init'));
    const {request} = yield* _(LoaderArgs);
    yield* _(getCurrentUserId(request));

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError({})),
      UserNotFoundError: () =>
        LoaderArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
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
