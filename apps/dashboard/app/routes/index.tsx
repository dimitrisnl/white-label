import type {MetaFunction} from '@remix-run/node';
import * as Effect from 'effect/Effect';

import {ErrorPage} from '@/components/error-page';
import {Redirect, ServerError} from '@/modules/responses.server';
import {requireUser} from '@/modules/session.server';
import {LoaderArgs, withLoader} from '@/modules/with-loader.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    const {request} = yield* _(LoaderArgs);
    const {currentUser} = yield* _(requireUser(request));

    const {memberships} = currentUser;

    // Let them pick their org
    if (memberships.length > 1) {
      return new Redirect({
        to: `/teams`,
        init: request,
      });
    }

    return new Redirect({
      to: `/teams/${memberships[0].org.id}`,
      init: request,
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

export function ErrorBoundary() {
  return <ErrorPage />;
}

export const meta: MetaFunction = () => {
  return [
    {title: 'Dashboard'},
    {name: 'description', content: 'Main dashboard'},
  ];
};

export default function Index() {
  return <div>asdasdasd</div>;
}
