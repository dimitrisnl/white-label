import * as Effect from 'effect/Effect';

import {pool} from '~/core/db/pool.server';
import {db} from '~/core/db/schema.server';
import {PasswordResetTokenNotFoundError} from '~/core/lib/errors.server';
import {BadRequest, Ok, ServerError} from '~/core/lib/responses.server';
import {LoaderArgs, withLoader} from '~/core/lib/with-loader.server';
import {verifyPasswordReset} from '~/core/use-cases/verify-password-reset.server';

export const loader = withLoader(
  Effect.gen(function* () {
    const {request} = yield* LoaderArgs;

    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return yield* Effect.fail(new PasswordResetTokenNotFoundError());
    }

    const {validate, execute} = verifyPasswordReset({db, pool});
    const props = yield* validate({token});
    yield* execute(props);

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
