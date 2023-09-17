import * as Effect from 'effect/Effect';

import {PasswordResetTokenNotFoundError} from '@/modules/errors.server';
import {BadRequest, Ok, ServerError} from '@/modules/responses.server';
import {verifyPasswordReset} from '@/modules/use-cases/index.server';
import {LoaderArgs, withLoader} from '@/modules/with-loader.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    const {request} = yield* _(LoaderArgs);

    const token = new URL(request.url).searchParams.get('token');

    if (!token) {
      return yield* _(Effect.fail(new PasswordResetTokenNotFoundError()));
    }

    const {validate, execute} = verifyPasswordReset();

    const props = yield* _(validate({token}));

    yield* _(execute(props));

    return new Ok({data: {token}});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError({})),
      PasswordResetTokenNotFoundError: () =>
        Effect.fail(new BadRequest({errors: ['Token not found']})),
      ValidationError: () =>
        Effect.fail(
          new BadRequest({errors: ['Token was in incorrect format']})
        ),
    })
  )
);

export type ResetPasswordLoader = typeof loader;
