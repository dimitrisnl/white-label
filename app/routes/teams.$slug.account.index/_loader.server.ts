import * as Effect from 'effect/Effect';

import {pool} from '~/core/db/pool.server';
import {db} from '~/core/db/schema.server';
import {authenticateUser} from '~/core/lib/helpers.server';
import {Ok, Redirect, ServerError} from '~/core/lib/responses.server';
import {LoaderArgs, withLoader} from '~/core/lib/with-loader.server';
import {getUser} from '~/core/use-cases/get-user.server';

export const loader = withLoader(
  Effect.gen(function* () {
    const {request} = yield* LoaderArgs;
    const userId = yield* authenticateUser(request);
    const {user} = yield* getUser({db, pool}).execute({userId});

    return new Ok({data: {user}});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError()),
      SessionNotFoundError: () =>
        LoaderArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
      UserNotFoundError: () =>
        LoaderArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
    })
  )
);

export type UserDetailsLoaderData = typeof loader;
