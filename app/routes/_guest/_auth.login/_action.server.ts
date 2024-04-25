import * as Effect from 'effect/Effect';

import {pool} from '~/core/db/pool.server';
import {db} from '~/core/db/schema.server';
import {parseFormData} from '~/core/lib/helpers.server';
import {BadRequest, ServerError} from '~/core/lib/responses.server';
import {createUserSession} from '~/core/lib/session.server';
import {ActionArgs, withAction} from '~/core/lib/with-action.server';
import {verifyUserCredentials} from '~/core/use-cases/verify-user-credentials.server';

export const action = withAction(
  Effect.gen(function* () {
    const {request} = yield* ActionArgs;

    const {validate, execute} = verifyUserCredentials({pool, db});
    const data = yield* parseFormData(request);
    const props = yield* validate(data);
    const user = yield* execute(props);

    return yield* createUserSession({
      userId: user.id,
      redirectToPath: '/',
      remember: true,
      request,
    });
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError()),
      InvalidCredentialsError: () =>
        Effect.fail(
          new BadRequest({errors: ['The credentials you provided are wrong']})
        ),
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
    })
  )
);

export type LoginRequestAction = typeof action;
