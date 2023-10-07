import * as Effect from 'effect/Effect';

import {parseFormData} from '@/modules/helpers.server';
import {BadRequest, Redirect, ServerError} from '@/modules/responses.server';
import {resetPassword} from '@/modules/use-cases/index.server';
import {ActionArgs, withAction} from '@/modules/with-action.server';

export const action = withAction(
  Effect.gen(function* (_) {
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
