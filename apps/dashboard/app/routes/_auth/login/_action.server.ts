import * as Effect from 'effect/Effect';

import {BadRequest, ServerError} from '@/modules/responses.server';
import {createUserSession} from '@/modules/session.server';
import {verifyUserCredentials} from '@/modules/use-cases/index.server';
import {ActionArgs, withAction} from '@/modules/with-action.server';

export const action = withAction(
  Effect.gen(function* (_) {
    const {request} = yield* _(ActionArgs);
    const formData = yield* _(Effect.promise(() => request.formData()));
    const {validate, execute} = verifyUserCredentials();
    const props = yield* _(validate(Object.fromEntries(formData)));
    const user = yield* _(execute(props));

    return yield* _(
      createUserSession({
        userId: user.id,
        redirectToPath: '/teams',
        remember: true,
        request,
      })
    );
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError({})),
      InvalidCredentialsError: () =>
        Effect.fail(
          new BadRequest({errors: ['The credentials you provided are wrong']})
        ),
      ValidationError: () =>
        Effect.fail(new BadRequest({errors: ['Validation Error']})),
    })
  )
);

export type LoginRequestAction = typeof action;
