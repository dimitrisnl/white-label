import * as Effect from 'effect/Effect';

import {pool} from '~/core/db/pool.server';
import {db} from '~/core/db/schema.server';
import {VerifyEmailTokenNotFoundError} from '~/core/lib/errors.server';
import {
  BadRequest,
  Ok,
  Redirect,
  ServerError,
} from '~/core/lib/responses.server';
import {LoaderArgs, withLoader} from '~/core/lib/with-loader.server';
import {verifyEmailToken} from '~/core/use-cases/verify-email-token.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    const {request} = yield* _(LoaderArgs);

    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return yield* _(Effect.fail(new VerifyEmailTokenNotFoundError()));
    }

    const {validate, execute} = verifyEmailToken({pool, db});
    const props = yield* _(validate({token}));

    yield* _(execute(props));

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
      InternalServerError: () => Effect.fail(new ServerError()),
      VerifyEmailTokenNotFoundError: () =>
        Effect.fail(
          new BadRequest({errors: ['Verification email token is invalid']})
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

export type VerifyEmailLoader = typeof loader;
