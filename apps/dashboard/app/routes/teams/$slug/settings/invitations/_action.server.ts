import * as Effect from 'effect/Effect';

import {sendEmail} from '@/mailer';
import {Org, User} from '@/modules/domain/index.server';
import {InvalidIntent} from '@/modules/errors.server';
import {
  getCurrentUserId,
  identifyOrgByParams,
  parseFormData,
} from '@/modules/helpers.server';
import {
  BadRequest,
  Forbidden,
  Ok,
  Redirect,
  ServerError,
} from '@/modules/responses.server';
import {
  createInvitation,
  deleteInvitation,
} from '@/modules/use-cases/index.server';
import {ActionArgs, withAction} from '@/modules/with-action.server';

function handleInvitationCreation({
  userId,
  orgId,
  data,
}: {
  userId: User.User['id'];
  orgId: Org.Org['id'];
  data: Record<string, unknown>;
}) {
  return Effect.gen(function* (_) {
    const {validate, execute} = createInvitation();
    const props = yield* _(validate(data));

    const invitation = yield* _(execute(props, orgId, userId));

    yield* _(
      sendEmail({
        to: invitation.email,
        subject: `You have been invited to join ${invitation.org.name}`,
        content: {
          type: 'PLAIN',
          message: `Here's your token: ${invitation.id}`,
        },
      })
    );
  });
}

function handleInvitationDeletion({
  userId,
  orgId,
  data,
}: {
  userId: User.User['id'];
  orgId: Org.Org['id'];
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
    yield* _(Effect.log('Action(teams/$slug/settings/invitations): Init'));
    const {request, params} = yield* _(ActionArgs);

    const userId = yield* _(getCurrentUserId(request));
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
            errors: ["You don't have access to invite a team member"],
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
