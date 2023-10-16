import * as Effect from 'effect/Effect';

import {sendVerificationEmail} from '@/mailer/emails/send-verification-email.server';
import {parseFormData} from '@/modules/helpers.server';
import {BadRequest, ServerError} from '@/modules/responses.server';
import {createUserSession} from '@/modules/session.server';
import {createUser} from '@/modules/use-cases/index.server';
import {ActionArgs, withAction} from '@/modules/with-action.server';

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
