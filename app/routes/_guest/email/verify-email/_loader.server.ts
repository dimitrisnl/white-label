import * as Effect from 'effect/Effect';

import {VerifyEmailTokenNotFoundError} from '~/core/lib/errors.server';
import {
  BadRequest,
  Ok,
  Redirect,
  ServerError,
} from '~/core/lib/responses.server';
import {LoaderArgs, withLoader} from '~/core/lib/with-loader.server';
import {verifyEmailToken} from '~/core/use-cases/index.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Loader(_guest/email/verify-email): Init'));
    const {params} = yield* _(LoaderArgs);
    const {token} = params;

    if (!token) {
      return yield* _(Effect.fail(new VerifyEmailTokenNotFoundError()));
    }

    const {validate, execute} = verifyEmailToken();
    const props = yield* _(validate({token}));
    yield* _(execute(props));

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
      InternalServerError: () => Effect.fail(new ServerError({})),
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
