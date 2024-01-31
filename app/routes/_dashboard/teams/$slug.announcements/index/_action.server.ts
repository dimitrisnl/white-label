import * as Effect from 'effect/Effect';

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
import {createAnnouncement} from '~/core/use-cases/create-announcement.server';

export const action = withAction(
  Effect.gen(function* (_) {
    const {request, params} = yield* _(ActionArgs);
    const userId = yield* _(authenticateUser(request));
    const orgId = yield* _(identifyOrgByParams(params));

    const {validate, execute} = createAnnouncement();
    const data = yield* _(parseFormData(request));
    const props = yield* _(validate(data));
    yield* _(execute(props, orgId, userId));

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
      InternalServerError: () => Effect.fail(new ServerError({})),
      SessionNotFoundError: () =>
        ActionArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
      OrgSlugParseError: () =>
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

export type CreateAnnouncementAction = typeof action;
