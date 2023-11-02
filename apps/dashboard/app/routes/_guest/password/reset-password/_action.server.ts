import * as Effect from 'effect/Effect';

import {parseFormData} from '~/modules/helpers.server.ts';
import {BadRequest, Redirect, ServerError} from '~/modules/responses.server.ts';
import {resetPassword} from '~/modules/use-cases/index.server.ts';
import {ActionArgs, withAction} from '~/modules/with-action.server.ts';

export const action = withAction(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Action(_guest/password/reset-password): Init'));
    const {request} = yield* _(ActionArgs);

    const {validate, execute} = resetPassword();
    const data = yield* _(parseFormData(request));
    const props = yield* _(validate(data));

    yield* _(execute(props));

    return new Redirect({
      to: '/login?resetPassword=true',
      init: request,
    });
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError({})),
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
