import * as Effect from 'effect/Effect';

import {BadRequest, ServerError} from '@/modules/responses.server';
import {createUserSession} from '@/modules/session.server';
import {createUser} from '@/modules/use-cases/index.server';
import {ActionArgs, withAction} from '@/modules/with-action.server';

export const action = withAction(
  Effect.gen(function* (_) {
    const {request} = yield* _(ActionArgs);
    const formData = yield* _(Effect.promise(() => request.formData()));

    const {validate, execute} = createUser();
    const props = yield* _(validate(Object.fromEntries(formData)));
    const {user} = yield* _(execute(props));

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
      AccountAlreadyExistsError: () =>
        Effect.fail(
          new BadRequest({errors: ['The email you provided is taken']})
        ),
      ValidationError: () =>
        Effect.fail(new BadRequest({errors: ['Validation Error']})),
    })
  )
);

export type RegisterRequestAction = typeof action;
