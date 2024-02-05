import * as Effect from 'effect/Effect';

import {pool} from '~/core/db/pool.server';
import {db} from '~/core/db/schema.server';
import {parseFormData} from '~/core/lib/helpers.server';
import {BadRequest, Redirect, ServerError} from '~/core/lib/responses.server';
import {ActionArgs, withAction} from '~/core/lib/with-action.server';
import {resetPassword} from '~/core/use-cases/reset-password.server';

export const action = withAction(
  Effect.gen(function* (_) {
    const {request} = yield* _(ActionArgs);

    const {validate, execute} = resetPassword({db, pool});
    const data = yield* _(parseFormData(request));
    const props = yield* _(validate(data));

    yield* _(execute(props));

    return new Redirect({to: '/login?resetPassword=true'});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError()),
      PasswordResetTokenNotFoundError: () =>
        Effect.fail(
          new BadRequest({errors: ['Password reset token is invalid']})
        ),
      UserNotFoundError: () =>
        Effect.fail(
          new BadRequest({errors: ['Password reset token is invalid']})
        ),
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
    })
  )
);

export type ResetPasswordAction = typeof action;
