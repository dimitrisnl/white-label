import * as Effect from 'effect/Effect';

import {VerifyEmailTokenNotFoundError} from '@/modules/errors.server';
import {BadRequest, Ok, ServerError} from '@/modules/responses.server';
import {verifyEmailToken} from '@/modules/use-cases/index.server';
import {LoaderArgs, withLoader} from '@/modules/with-loader.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
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
      InternalServerError: () => Effect.fail(new ServerError({})),
      // Impossible, need to double check the implementation
      UserNotFoundError: () =>
        Effect.fail(new BadRequest({errors: ['User not found']})),
      VerifyEmailTokenNotFoundError: () =>
        Effect.fail(new BadRequest({errors: ['Token not found']})),
      ValidationError: () =>
        Effect.fail(
          new BadRequest({errors: ['Token was in incorrect format']})
        ),
    })
  )
);

export type VerifyEmailLoader = typeof loader;
