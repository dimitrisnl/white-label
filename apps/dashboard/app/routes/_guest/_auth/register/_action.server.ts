import * as Effect from 'effect/Effect';

import {sendEmail} from '@/mailer';
import {parseFormData} from '@/modules/helpers.server';
import {BadRequest, ServerError} from '@/modules/responses.server';
import {createUserSession} from '@/modules/session.server';
import {createUser} from '@/modules/use-cases/index.server';
import {ActionArgs, withAction} from '@/modules/with-action.server';

export const action = withAction(
  Effect.gen(function* (_) {
    const {request} = yield* _(ActionArgs);

    const {validate, execute} = createUser();
    const data = yield* _(parseFormData(request));
    const props = yield* _(validate(data));
    const {user, verifyEmailTokenId} = yield* _(execute(props));

    // todo: Get it from Context, Add message to queue, Write templates
    yield* _(
      sendEmail({
        to: user.email,
        subject: 'Verify your email',
        content: {
          type: 'PLAIN',
          message: `Here's your token: ${verifyEmailTokenId}`,
        },
      })
    );

    return yield* _(
      createUserSession({
        userId: user.id,
        redirectToPath: '/onboarding',
        remember: true,
        request,
      })
    );
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError({})),
      AccountAlreadyExistsError: () =>
        Effect.fail(
          new BadRequest({errors: ['The email you provided is taken']})
        ),
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
    })
  )
);

export type RegisterRequestAction = typeof action;
