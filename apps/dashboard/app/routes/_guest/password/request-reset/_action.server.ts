import * as Effect from 'effect/Effect';

import {sendPasswordResetEmail} from '@/mailer/emails/send-password-reset-email';
import {parseFormData} from '@/modules/helpers.server';
import {BadRequest, Ok, ServerError} from '@/modules/responses.server';
import {requestPasswordReset} from '@/modules/use-cases/index.server';
import {ActionArgs, withAction} from '@/modules/with-action.server';

export const action = withAction(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Action(_guest/password/request-reset): Init'));
    const {request} = yield* _(ActionArgs);

    const {validate, execute} = requestPasswordReset();
    const data = yield* _(parseFormData(request));
    const props = yield* _(validate(data));
    const {passwordResetTokenId, email} = yield* _(execute(props));

    yield* _(sendPasswordResetEmail({email, passwordResetTokenId}));

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError({})),
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
      UserNotFoundError: () =>
        Effect.fail(
          new BadRequest({
            errors: [
              "We couldn't find an account with this email in our records",
            ],
          })
        ),
    })
  )
);

export type RequestPasswordResetAction = typeof action;
