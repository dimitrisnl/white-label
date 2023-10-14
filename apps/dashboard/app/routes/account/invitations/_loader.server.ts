import * as Effect from 'effect/Effect';

import {getCurrentUserId} from '@/modules/helpers.server';
import {Ok, Redirect, ServerError} from '@/modules/responses.server';
import {getUserInvitations} from '@/modules/use-cases/index.server';
import {LoaderArgs, withLoader} from '@/modules/with-loader.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Loader(account/invitations): Init'));
    const {request} = yield* _(LoaderArgs);
    const userId = yield* _(getCurrentUserId(request));

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
