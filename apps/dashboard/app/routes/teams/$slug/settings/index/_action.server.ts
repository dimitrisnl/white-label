import * as Effect from 'effect/Effect';

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
import {editOrg} from '@/modules/use-cases/index.server';
import {ActionArgs, withAction} from '@/modules/with-action.server';

export const action = withAction(
  Effect.gen(function* (_) {
    const {request, params} = yield* _(ActionArgs);

    const userId = yield* _(getCurrentUserId(request));
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

export type Action = typeof action;
