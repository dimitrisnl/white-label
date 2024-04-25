import * as Effect from 'effect/Effect';

import {pool} from '~/core/db/pool.server';
import {db} from '~/core/db/schema.server';
import {parseFormData} from '~/core/lib/helpers.server.ts';
import {BadRequest, Ok, ServerError} from '~/core/lib/responses.server.ts';
import {ActionArgs, withAction} from '~/core/lib/with-action.server.ts';
import {sendPasswordResetEmail} from '~/core/mailer/emails/send-password-reset-email.server.tsx';
import {requestPasswordReset} from '~/core/use-cases/request-password-reset.server';

export const action = withAction(
  Effect.gen(function* () {
    const {request} = yield* ActionArgs;

    const {validate, execute} = requestPasswordReset({db, pool});
    const data = yield* parseFormData(request);
    const props = yield* validate(data);
    const {passwordResetTokenId, email} = yield* execute(props);

    yield* sendPasswordResetEmail({email, passwordResetTokenId});

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError()),
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
