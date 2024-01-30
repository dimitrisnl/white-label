import * as Effect from 'effect/Effect';

import type {Org} from '~/core/domain/org.server';
import type {User} from '~/core/domain/user.server';
import {InvalidIntent} from '~/core/lib/errors.server';
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
  return Effect.gen(function* (_) {
    const {validate, execute} = createInvitation();
    const props = yield* _(validate(data));

    const invitation = yield* _(execute(props, orgId, userId));

    yield* _(
      sendInvitationEmail({
        email: invitation.email,
        orgName: invitation.org.name,
        invitationTokenId: invitation.id,
      })
    );
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
  return Effect.gen(function* (_) {
    const {validate, execute} = deleteInvitation();
    const props = yield* _(validate(data));

    yield* _(execute(props, orgId, userId));
  });
}

export const action = withAction(
  Effect.gen(function* (_) {
    yield* _(
      Effect.log('Action(_dashboard/teams/$slug/settings/invitations): Init')
    );
    const {request, params} = yield* _(ActionArgs);

    const userId = yield* _(authenticateUser(request));
    const orgId = yield* _(identifyOrgByParams(params));
    const data = yield* _(parseFormData(request));

    const intent = data.intent;

    if (intent === 'delete') {
      yield* _(
        handleInvitationDeletion({
          userId,
          orgId,
          data,
        })
      );
      return new Ok({data: null});
    }

    if (intent === 'create') {
      yield* _(handleInvitationCreation({userId, orgId, data}));
      return new Ok({data: null});
    }

    return yield* _(Effect.fail(new InvalidIntent()));
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError({})),
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
      ParseOrgSlugError: () =>
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
      InvalidIntent: () =>
        Effect.fail(new BadRequest({errors: ['Invalid Intent']})),
    })
  )
);

export type Action = typeof action;
