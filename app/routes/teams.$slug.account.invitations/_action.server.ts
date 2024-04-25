import * as Effect from 'effect/Effect';

import {pool} from '~/core/db/pool.server';
import {db} from '~/core/db/schema.server';
import {authenticateUser, parseFormData} from '~/core/lib/helpers.server';
import {BadRequest, Redirect, ServerError} from '~/core/lib/responses.server';
import {ActionArgs, withAction} from '~/core/lib/with-action.server';
import {acceptInvitation} from '~/core/use-cases/accept-invitation.server';

export const action = withAction(
  Effect.gen(function* () {
    const {request} = yield* ActionArgs;

    const userId = yield* authenticateUser(request);
    const data = yield* parseFormData(request);

    const {validate, execute} = acceptInvitation({db, pool});

    const props = yield* validate({invitationId: data.invitationId});
    const {org} = yield* execute({props, userId});

    return new Redirect({
      to: `/teams/${org.slug}`,
      init: request,
    });
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError()),
      OrgNotFoundError: () =>
        Effect.fail(new BadRequest({errors: ['Organization not found']})),
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
