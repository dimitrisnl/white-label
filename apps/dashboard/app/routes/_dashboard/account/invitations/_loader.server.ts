import * as Effect from 'effect/Effect';

import {authenticateUser} from '~/modules/helpers.server.ts';
import {Ok, Redirect, ServerError} from '~/modules/responses.server.ts';
import {getUserInvitations} from '~/modules/use-cases/index.server.ts';
import {LoaderArgs, withLoader} from '~/modules/with-loader.server.ts';

export const loader = withLoader(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Loader(_dashboard/account/invitations): Init'));
    const {request} = yield* _(LoaderArgs);
    const {id: userId} = yield* _(authenticateUser(request));

    const invitations = yield* _(getUserInvitations().execute(userId));

    return new Ok({data: invitations});
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
