import * as Effect from 'effect/Effect';

import {getCurrentUserId, parseFormData} from '@/modules/helpers.server.ts';
import {BadRequest, Redirect, ServerError} from '@/modules/responses.server.ts';
import {acceptInvitation} from '@/modules/use-cases/index.server.ts';
import {ActionArgs, withAction} from '@/modules/with-action.server.ts';

export const action = withAction(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Action(_dashboard/account/invitations): Init'));
    const {request} = yield* _(ActionArgs);
    const userId = yield* _(getCurrentUserId(request));

    const data = yield* _(parseFormData(request));

    const {validate, execute} = acceptInvitation();

    const props = yield* _(validate({invitationId: data.invitationId}));
    const invitation = yield* _(execute(props, userId));

    return new Redirect({
      to: `/teams/${invitation.org.slug}`,
      init: request,
    });
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError({})),
      InvitationNotFoundError: () =>
        Effect.fail(new BadRequest({errors: ['Invitation not found']})),
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
      SessionNotFoundError: () =>
        ActionArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
    })
  )
);

export type AcceptInvitationAction = typeof action;
