import * as Effect from 'effect/Effect';

import type {User} from '@/modules/domain/index.server';
import {
  BadRequest,
  Ok,
  Redirect,
  ServerError,
} from '@/modules/responses.server';
import {requireUserId} from '@/modules/session.server';
import {changePassword, editUser} from '@/modules/use-cases/index.server';
import {ActionArgs, withAction} from '@/modules/with-action.server';

function handleNameChange(formData: FormData, userId: User.User['id']) {
  return Effect.gen(function* (_) {
    const {validate, execute} = editUser();
    const props = yield* _(validate(Object.fromEntries(formData)));

    yield* _(execute(props, userId));

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError({})),
      ValidationError: () => {
        return Effect.fail(new BadRequest({errors: ['Validation Error']}));
      },
    })
  );
}

function handlePasswordChange(formData: FormData, userId: User.User['id']) {
  return Effect.gen(function* (_) {
    const {validate, execute} = changePassword();
    const props = yield* _(validate(Object.fromEntries(formData)));

    yield* _(execute(props, userId));

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError({})),
      ValidationError: () =>
        Effect.fail(new BadRequest({errors: ['Validation Error']})),
      UserNotFoundError: () =>
        Effect.fail(new BadRequest({errors: ['User not found']})),
      IncorrectPasswordError: () =>
        Effect.fail(new BadRequest({errors: ['Incorrect password']})),
    })
  );
}

export const action = withAction(
  Effect.gen(function* (_) {
    const {request} = yield* _(ActionArgs);
    const userId = yield* _(requireUserId(request));
    const formData = yield* _(Effect.promise(() => request.formData()));
    const formName = formData.get('formName');

    if (formName === 'CHANGE_NAME_FORM') {
      formData.delete('formName');
      return yield* _(handleNameChange(formData, userId));
    } else if (formName === 'CHANGE_PASSWORD_FORM') {
      formData.delete('formName');
      return yield* _(handlePasswordChange(formData, userId));
    }

    // no match
    throw new BadRequest({errors: ['Invalid action']});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError({})),
      SessionNotFoundError: () =>
        ActionArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
    })
  )
);

export type Action = typeof action;
