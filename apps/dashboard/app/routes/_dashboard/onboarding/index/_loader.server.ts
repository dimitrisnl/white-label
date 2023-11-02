import * as Effect from 'effect/Effect';

import {getCurrentUserDetails} from '~/modules/helpers.server.ts';
import {Ok, Redirect, ServerError} from '~/modules/responses.server.ts';
import {LoaderArgs, withLoader} from '~/modules/with-loader.server.ts';

export const loader = withLoader(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Loader(_dashboard/onboarding/index): Init'));
    const {request} = yield* _(LoaderArgs);
    const {memberships} = yield* _(getCurrentUserDetails(request));

    if (memberships.length > 0 && memberships[0]?.org) {
      return new Redirect({
        to: `/teams/${memberships[0].org.slug}`,
        init: request,
      });
    }

    return new Ok({data: null});
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
