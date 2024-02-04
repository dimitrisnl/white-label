import * as Effect from 'effect/Effect';

import {PasswordResetTokenNotFoundError} from '~/core/lib/errors.server';
import {BadRequest, Ok, ServerError} from '~/core/lib/responses.server';
import {LoaderArgs, withLoader} from '~/core/lib/with-loader.server';
import {verifyPasswordReset} from '~/core/use-cases/verify-password-reset.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    const {request} = yield* _(LoaderArgs);

    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return yield* _(Effect.fail(new PasswordResetTokenNotFoundError()));
    }

    const {validate, execute} = verifyPasswordReset();
    const props = yield* _(validate({token}));
    yield* _(execute(props));

    return new Ok({data: {token}});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError()),
      PasswordResetTokenNotFoundError: () =>
        Effect.fail(
          new BadRequest({errors: ['Password reset token is invalid']})
        ),
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
    })
  )
);

export type ResetPasswordLoader = typeof loader;
