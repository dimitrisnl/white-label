import * as Effect from 'effect/Effect';

import {parseFormData} from '~/modules/helpers.server.ts';
import {BadRequest, ServerError} from '~/modules/responses.server.ts';
import {createUserSession} from '~/modules/session.server.ts';
import {verifyUserCredentials} from '~/modules/use-cases/index.server.ts';
import {ActionArgs, withAction} from '~/modules/with-action.server.ts';

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
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
    })
  )
);

export type LoginRequestAction = typeof action;
