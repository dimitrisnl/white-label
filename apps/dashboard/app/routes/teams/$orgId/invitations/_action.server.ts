import * as Effect from 'effect/Effect';

import type {User} from '@/modules/domain/index.server';
import {Org} from '@/modules/domain/index.server';
import {
  BadRequest,
  Forbidden,
  Ok,
  Redirect,
  ServerError,
} from '@/modules/responses.server';
import {requireUserId} from '@/modules/session.server';
import {createInvitation} from '@/modules/use-cases/index.server';
import {ActionArgs, withAction} from '@/modules/with-action.server';

function handleMembershipInvitation({
  formData,
  orgId,
  userId,
}: {
  formData: FormData;
  orgId: Org.Org['id'];
  userId: User.User['id'];
}) {
  return Effect.gen(function* (_) {
    const {validate, execute} = createInvitation();
    const props = yield* _(validate(Object.fromEntries(formData)));

    yield* _(execute(props, orgId, userId));

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      DatabaseError: () => Effect.fail(new ServerError({})),
      DbRecordParseError: () => Effect.fail(new ServerError({})),
      ForbiddenActionError: () =>
        Effect.fail(
          new Forbidden({
            errors: ["You don't have access to invite a team member"],
          })
        ),
      ValidationError: () =>
        Effect.fail(new BadRequest({errors: ['Validation Error']})),
    })
  );
}

export const action = withAction(
  Effect.gen(function* (_) {
    const {request, params} = yield* _(ActionArgs);
    const userId = yield* _(requireUserId(request));

    const formData = yield* _(Effect.promise(() => request.formData()));
    const orgId = yield* _(Org.parseId(params.orgId));

    return yield* _(handleMembershipInvitation({formData, orgId, userId}));
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError({})),
      ValidationError: () =>
        ActionArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
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
