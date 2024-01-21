import * as Effect from 'effect/Effect';

import {parseFormData} from '~/core/lib/helpers.server';
import {BadRequest, ServerError} from '~/core/lib/responses.server';
import {createUserSession} from '~/core/lib/session.server';
import {ActionArgs, withAction} from '~/core/lib/with-action.server';
import {verifyUserCredentials} from '~/core/use-cases/index.server';

export const action = withAction(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Action(_guest/_auth/login): Init'));
    const {request} = yield* _(ActionArgs);

    const {validate, execute} = verifyUserCredentials();
    const data = yield* _(parseFormData(request));
    const props = yield* _(validate(data));
    const user = yield* _(execute(props));

    return yield* _(
      createUserSession({
        userId: user.id,
        redirectToPath: '/',
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
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
    })
  )
);

export type LoginRequestAction = typeof action;
