import * as Effect from 'effect/Effect';

import type {Org} from '~/core/domain/org.server';
import type {User} from '~/core/domain/user.server';
import {
  authenticateUser,
  identifyOrgByParams,
  parseFormData,
} from '~/core/lib/helpers.server';
import {
  BadRequest,
  Ok,
  Redirect,
  ServerError,
} from '~/core/lib/responses.server';
import {ActionArgs, withAction} from '~/core/lib/with-action.server';
import {deleteAnnouncement} from '~/core/use-cases/delete-announcement.server';

function handleAnnouncementDeletion({
  userId,
  orgId,
  data,
}: {
  userId: User['id'];
  orgId: Org['id'];
  data: Record<string, unknown>;
}) {
  return Effect.gen(function* (_) {
    const {validate, execute} = deleteAnnouncement();
    const props = yield* _(validate(data));

    yield* _(execute({props, orgId, userId}));
  });
}

export const action = withAction(
  Effect.gen(function* (_) {
    const {request, params} = yield* _(ActionArgs);

    const userId = yield* _(authenticateUser(request));
    const orgId = yield* _(identifyOrgByParams(params));
    const data = yield* _(parseFormData(request));

    const intent = data.intent;

    if (intent === 'delete') {
      yield* _(
        handleAnnouncementDeletion({
          userId,
          orgId,
          data,
        })
      );
      return new Ok({data: null});
    }

    return yield* _(
      Effect.fail(
        new BadRequest({errors: ['We could not process your request']})
      )
    );
  }).pipe(
    Effect.catchTags({
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
      InternalServerError: () => Effect.fail(new ServerError()),
      SessionNotFoundError: () =>
        ActionArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
      ForbiddenActionError: () =>
        Effect.fail(
          new BadRequest({errors: ["We couldn't find this announcement"]})
        ),
      AnnouncementNotFoundError: () =>
        Effect.fail(
          new BadRequest({errors: ["We couldn't find this announcement"]})
        ),
      OrgSlugParseError: () =>
        Effect.fail(new BadRequest({errors: ["We couldn't find this team"]})),
      OrgNotFoundError: () =>
        Effect.fail(new BadRequest({errors: ["We couldn't find this team"]})),
    })
  )
);

export type Action = typeof action;
