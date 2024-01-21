import * as Effect from 'effect/Effect';

import {parseFormData} from '~/core/lib/helpers.server';
import {BadRequest, ServerError} from '~/core/lib/responses.server';
import {createUserSession} from '~/core/lib/session.server';
import {ActionArgs, withAction} from '~/core/lib/with-action.server';
import {sendVerificationEmail} from '~/core/mailer/emails/send-verification-email.server';
import {createUser} from '~/core/use-cases/index.server';

export const action = withAction(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Action(_guest/_auth/register): Init'));

    const {request} = yield* _(ActionArgs);

    const {validate, execute} = createUser();
    const data = yield* _(parseFormData(request));
    const props = yield* _(validate(data));
    const {user, verifyEmailTokenId} = yield* _(execute(props));

    yield* _(sendVerificationEmail({email: user.email, verifyEmailTokenId}));

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
