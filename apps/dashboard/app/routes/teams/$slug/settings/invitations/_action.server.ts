import * as Effect from 'effect/Effect';

import {sendEmail} from '@/mailer';
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
import {createInvitation} from '@/modules/use-cases/index.server';
import {ActionArgs, withAction} from '@/modules/with-action.server';

export const action = withAction(
  Effect.gen(function* (_) {
    const {request, params} = yield* _(ActionArgs);

    const userId = yield* _(getCurrentUserId(request));
    const orgId = yield* _(identifyOrgByParams(params));

    const {validate, execute} = createInvitation();
    const data = yield* _(parseFormData(request));
    const props = yield* _(validate(data));

    const invitation = yield* _(execute(props, orgId, userId));

    // We do this as I consider route to be my adapter. Side-effects happen here.
    // todo: Get it from Context, Add message to queue, Write templates
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

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError({})),
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
      InviteeAlreadyMemberError: () =>
        Effect.fail(
          new BadRequest({errors: ['Invitee is already member of the team']})
        ),
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
    })
  )
);

export type Action = typeof action;
