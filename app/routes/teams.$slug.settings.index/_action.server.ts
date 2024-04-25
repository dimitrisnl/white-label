import * as Effect from 'effect/Effect';

import {pool} from '~/core/db/pool.server';
import {db} from '~/core/db/schema.server';
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
  Effect.gen(function* () {
    const {request, params} = yield* ActionArgs;

    const userId = yield* authenticateUser(request);
    const orgId = yield* identifyOrgByParams(params);
    const data = yield* parseFormData(request);

    const {validate, execute} = editOrg({db, pool});
    const props = yield* validate(data);

    yield* execute({props, orgId, userId});

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
