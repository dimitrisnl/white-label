import * as Effect from 'effect/Effect';

import {pool} from '~/core/db/pool.server';
import {db} from '~/core/db/schema.server';
import {parseFormData} from '~/core/lib/helpers.server';
import {BadRequest, ServerError} from '~/core/lib/responses.server';
import {createUserSession} from '~/core/lib/session.server';
import {ActionArgs, withAction} from '~/core/lib/with-action.server';
import {sendVerificationEmail} from '~/core/mailer/emails/send-verification-email.server';
import {createUser} from '~/core/use-cases/create-user.server';

export const action = withAction(
  Effect.gen(function* () {
    const {request} = yield* ActionArgs;

    const {validate, execute} = createUser({db, pool});
    const data = yield* parseFormData(request);
    const props = yield* validate(data);
    const {user, verifyEmailTokenId} = yield* execute(props);

    yield* sendVerificationEmail({email: user.email, verifyEmailTokenId});

    return yield* createUserSession({
      userId: user.id,
      redirectToPath: '/onboarding',
      remember: true,
      request,
    });
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError()),
      AccountAlreadyExistsError: () =>
        Effect.fail(
          new BadRequest({errors: ['The email you provided is taken']})
        ),
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
    })
  )
);

export type RegisterRequestAction = typeof action;
