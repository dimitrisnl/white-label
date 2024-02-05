import * as Effect from 'effect/Effect';

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
import {ActionArgs, withAction} from '~/core/lib/with-action.server.ts';
import {editOrg} from '~/core/use-cases/edit-org.server';

export const action = withAction(
  Effect.gen(function* (_) {
    const {request, params} = yield* _(ActionArgs);

    const userId = yield* _(authenticateUser(request));
    const orgId = yield* _(identifyOrgByParams(params));
    const data = yield* _(parseFormData(request));

    const {validate, execute} = editOrg();
    const props = yield* _(validate(data));

    yield* _(execute({props, orgId, userId}));

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError()),
      OrgNotFoundError: () =>
        Effect.fail(new BadRequest({errors: ["We couldn't find this team"]})),
      ForbiddenActionError: () =>
        Effect.fail(
          new Forbidden({
            errors: ["You don't have access to change the team name"],
          })
        ),
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
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
    })
  )
);

export type EditOrgAction = typeof action;
