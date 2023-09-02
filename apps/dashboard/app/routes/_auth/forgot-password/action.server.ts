import * as Effect from 'effect/Effect';

import {BadRequest, Ok, ServerError} from '@/modules/responses.server';
import {requestPasswordReset} from '@/modules/use-cases/index.server';
import {ActionArgs, withAction} from '@/modules/with-action.server';

export const action = withAction(
  Effect.gen(function* (_) {
    const {request} = yield* _(ActionArgs);
    const formData = yield* _(Effect.promise(() => request.formData()));
    const {validate, execute} = requestPasswordReset();

    const props = yield* _(validate(Object.fromEntries(formData)));
    yield* _(execute(props));

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError({})),
      ValidationError: () =>
        Effect.fail(
          new BadRequest({
            errors: ['The email you provided seems to be in the wrong format'],
          })
        ),
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

export type ForgotPasswordAction = typeof action;
