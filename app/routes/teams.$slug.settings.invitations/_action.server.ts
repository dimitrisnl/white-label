import * as Effect from 'effect/Effect';

import {pool} from '~/core/db/pool.server';
import {db} from '~/core/db/schema.server';
import type {Org} from '~/core/domain/org.server';
import type {User} from '~/core/domain/user.server';
import {
  authenticateUser,
  identifyOrgByParams,
  parseFormData,
} from '~/core/lib/helpers.server';
import {
  BadRequest,
  Forbidden,
  Ok,
  Redirect,
  ServerError,
} from '~/core/lib/responses.server';
import {ActionArgs, withAction} from '~/core/lib/with-action.server';
import {sendInvitationEmail} from '~/core/mailer/emails/send-invitation-email.server';
import {createInvitation} from '~/core/use-cases/create-invitation.server';
import {deleteInvitation} from '~/core/use-cases/delete-invitation.server';

function handleInvitationCreation({
  userId,
  orgId,
  data,
}: {
  userId: User['id'];
  orgId: Org['id'];
  data: Record<string, unknown>;
}) {
  return Effect.gen(function* () {
    const {validate, execute} = createInvitation({db, pool});
    const props = yield* validate(data);

    const invitation = yield* execute({props, orgId, userId});

    yield* sendInvitationEmail({
      email: invitation.email,
      orgName: invitation.org.name,
      invitationTokenId: invitation.id,
    });
  });
}

function handleInvitationDeletion({
  userId,
  orgId,
  data,
}: {
  userId: User['id'];
  orgId: Org['id'];
  data: Record<string, unknown>;
}) {
  return Effect.gen(function* () {
    const {validate, execute} = deleteInvitation({db, pool});
    const props = yield* validate(data);

    yield* execute({props, orgId, userId});
  });
}

export const action = withAction(
  Effect.gen(function* () {
    const {request, params} = yield* ActionArgs;

    const userId = yield* authenticateUser(request);
    const orgId = yield* identifyOrgByParams(params);
    const data = yield* parseFormData(request);

    const intent = data.intent;

    if (intent === 'delete') {
      yield* handleInvitationDeletion({
        userId,
        orgId,
        data,
      });
      return new Ok({data: null});
    }

    if (intent === 'create') {
      yield* handleInvitationCreation({userId, orgId, data});
      return new Ok({data: null});
    }

    return yield* Effect.fail(
      new BadRequest({errors: ['We could not process your request']})
    );
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError()),
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
      InviteeAlreadyMemberError: () =>
        Effect.fail(
          new BadRequest({errors: ['Invitee is already member of the team']})
        ),
      InvitationNotFoundError: () =>
        Effect.fail(new BadRequest({errors: ['Invitation not found']})),
      ForbiddenActionError: () =>
        Effect.fail(
          new Forbidden({
            errors: ["You don't have access to do this action"],
          })
        ),
      OrgSlugParseError: () =>
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
      OrgNotFoundError: () =>
        ActionArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
    })
  )
);

export type Action = typeof action;
