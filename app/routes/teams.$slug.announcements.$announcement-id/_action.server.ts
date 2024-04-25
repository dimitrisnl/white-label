import * as Effect from 'effect/Effect';

import {pool} from '~/core/db/pool.server';
import {db} from '~/core/db/schema.server';
import {parseAnnouncementId} from '~/core/domain/announcement.server';
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
import {editAnnouncement} from '~/core/use-cases/edit-announcement.server';

export const action = withAction(
  Effect.gen(function* () {
    const {request, params} = yield* ActionArgs;

    const announcementId = yield* parseAnnouncementId(
      params['announcement-id']
    );
    const userId = yield* authenticateUser(request);
    const orgId = yield* identifyOrgByParams(params);

    const {validate, execute} = editAnnouncement({db, pool});
    const data = yield* parseFormData(request);
    const props = yield* validate(data);
    yield* execute({
      props,
      orgId,
      userId,
      announcementId,
    });

    return new Ok({data: null});
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
      AnnouncementIdParseError: () => Effect.fail(new ServerError()),
      OrgSlugParseError: () =>
        Effect.fail(new BadRequest({errors: ["We couldn't find this team"]})),
      OrgNotFoundError: () =>
        Effect.fail(new BadRequest({errors: ["We couldn't find this team"]})),
    })
  )
);

export type EditAnnouncementAction = typeof action;
