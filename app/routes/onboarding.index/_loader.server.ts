import * as Effect from 'effect/Effect';

import {pool} from '~/core/db/pool.server';
import {db} from '~/core/db/schema.server';
import {authenticateUser} from '~/core/lib/helpers.server';
import {Ok, Redirect, ServerError} from '~/core/lib/responses.server';
import {LoaderArgs, withLoader} from '~/core/lib/with-loader.server';
import {getUserMemberships} from '~/core/use-cases/get-user-memberships.server';

export const loader = withLoader(
  Effect.gen(function* () {
    const {request} = yield* LoaderArgs;
    const userId = yield* authenticateUser(request);
    const {memberships} = yield* getUserMemberships({db, pool}).execute({
      userId,
    });

    if (memberships.length > 0 && memberships[0]?.org) {
      return new Redirect({to: `/teams/${memberships[0].org.slug}`});
    }

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError()),
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
