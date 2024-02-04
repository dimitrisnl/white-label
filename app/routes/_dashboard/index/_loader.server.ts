import * as Effect from 'effect/Effect';

import {authenticateUser} from '~/core/lib/helpers.server';
import {Redirect, ServerError} from '~/core/lib/responses.server';
import {LoaderArgs, withLoader} from '~/core/lib/with-loader.server';
import {getUserMemberships} from '~/core/use-cases/get-user-memberships.server.ts';

export const loader = withLoader(
  Effect.gen(function* (_) {
    const {request} = yield* _(LoaderArgs);
    const userId = yield* _(authenticateUser(request));

    // todo: replace with query that gets the last accessed team
    const {memberships} = yield* _(getUserMemberships().execute({userId}));

    if (memberships.length === 0) {
      return new Redirect({
        to: `/onboarding`,
      });
    }

    return new Redirect({
      to: `/teams/${memberships[0]!.org.slug}`,
    });
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
