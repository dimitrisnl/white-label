import * as Effect from 'effect/Effect';

import {pool} from '~/core/db/pool.server';
import {db} from '~/core/db/schema.server';
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
  Effect.gen(function* () {
    const {request} = yield* ActionArgs;

    const userId = yield* authenticateUser(request);
    const {email, verifyEmailTokenId} = yield* regenerateVerifyEmailToken({
      db,
      pool,
    }).execute({
      userId,
    });

    yield* sendVerificationEmail({email, verifyEmailTokenId});

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
