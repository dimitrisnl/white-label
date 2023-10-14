import type {MetaFunction} from '@remix-run/node';
import * as Effect from 'effect/Effect';

import {ErrorPage} from '@/components/error-page';
import {getCurrentUserDetails} from '@/modules/helpers.server';
import {decideNextTeamRedirect} from '@/modules/navigation.server';
import {Redirect, ServerError} from '@/modules/responses.server';
import {LoaderArgs, withLoader} from '@/modules/with-loader.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Loader(index): Init'));
    const {request} = yield* _(LoaderArgs);
    const {memberships} = yield* _(getCurrentUserDetails(request));

    return decideNextTeamRedirect(memberships, request);
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

export function ErrorBoundary() {
  return <ErrorPage />;
}

export const meta: MetaFunction = () => {
  return [
    {title: 'Dashboard'},
    {name: 'description', content: 'Main dashboard'},
  ];
};
