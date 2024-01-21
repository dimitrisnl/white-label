import * as Effect from 'effect/Effect';

import {authenticateUser} from '~/core/lib/helpers.server';
import {Ok, Redirect, ServerError} from '~/core/lib/responses.server';
import {LoaderArgs, withLoader} from '~/core/lib/with-loader.server';
import {getUserMemberships} from '~/core/use-cases/index.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Loader(_dashboard/onboarding/index): Init'));
    const {request} = yield* _(LoaderArgs);
    const {id: userId} = yield* _(authenticateUser(request));
    const {memberships} = yield* _(getUserMemberships().execute(userId));

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
