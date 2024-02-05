import * as Effect from 'effect/Effect';

import {authenticateUser} from '~/core/lib/helpers.server';
import {
  BadRequest,
  Ok,
  Redirect,
  ServerError,
} from '~/core/lib/responses.server';
import {ActionArgs, withAction} from '~/core/lib/with-action.server';
import {sendVerificationEmail} from '~/core/mailer/emails/send-verification-email.server';
import {regenerateVerifyEmailToken} from '~/core/use-cases/regenerate-verify-email-token.server';

export const action = withAction(
  Effect.gen(function* (_) {
    const {request} = yield* _(ActionArgs);

    const userId = yield* _(authenticateUser(request));
    const {email, verifyEmailTokenId} = yield* _(
      regenerateVerifyEmailToken().execute({
        userId,
      })
    );

    yield* _(sendVerificationEmail({email, verifyEmailTokenId}));

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError()),
      UserEmailAlreadyVerifiedError: () =>
        Effect.fail(
          new BadRequest({errors: ['Your email is already verified.']})
        ),
      UserNotFoundError: () =>
        ActionArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
      SessionNotFoundError: () =>
        ActionArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
    })
  )
);

export type ResendVerificationAction = typeof action;
