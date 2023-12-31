import * as Effect from 'effect/Effect';

import {
  authenticateUser,
  identifyOrgByParams,
  parseFormData,
} from '~/modules/helpers.server.ts';
import {
  BadRequest,
  Forbidden,
  Ok,
  Redirect,
  ServerError,
} from '~/modules/responses.server.ts';
import {editOrg} from '~/modules/use-cases/index.server.ts';
import {ActionArgs, withAction} from '~/modules/with-action.server.ts';

export const action = withAction(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Action(_dashboard/teams/$slug/settings/index): Init'));
    const {request, params} = yield* _(ActionArgs);

    const {id: userId} = yield* _(authenticateUser(request));
    const orgId = yield* _(identifyOrgByParams(params));

    const {validate, execute} = editOrg();
    const data = yield* _(parseFormData(request));
    const props = yield* _(validate(data));

    yield* _(execute(props, orgId, userId));

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError({})),
      OrgNotFoundError: () =>
        Effect.fail(new BadRequest({errors: ["We couldn't find this team"]})),
      ForbiddenActionError: () =>
        new Forbidden({
          errors: ["You don't have acess to change the team name"],
        }),
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
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
    })
  )
);

export type EditOrgAction = typeof action;
