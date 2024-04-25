import * as Effect from 'effect/Effect';

import {pool} from '~/core/db/pool.server';
import {db} from '~/core/db/schema.server';
import {authenticateUser, identifyOrgByParams} from '~/core/lib/helpers.server';
import {
  BadRequest,
  Ok,
  Redirect,
  ServerError,
} from '~/core/lib/responses.server';
import {LoaderArgs, withLoader} from '~/core/lib/with-loader.server';
import {getOrg} from '~/core/use-cases/get-org.server';
import {getUser} from '~/core/use-cases/get-user.server';
import {getUserMemberships} from '~/core/use-cases/get-user-memberships.server';

export const loader = withLoader(
  Effect.gen(function* () {
    const {request, params} = yield* LoaderArgs;

    const userId = yield* authenticateUser(request);
    const {user} = yield* getUser({db, pool}).execute({userId});
    const orgId = yield* identifyOrgByParams(params);
    const org = yield* getOrg({db, pool}).execute({orgId, userId: user.id});
    const {memberships} = yield* getUserMemberships({db, pool}).execute({
      userId: user.id,
    });

    return new Ok({data: {org, memberships, user}});
  }).pipe(
    Effect.catchTags({
      OrgSlugParseError: () =>
        Effect.fail(new BadRequest({errors: ["We couldn't find this team"]})),
      OrgNotFoundError: () =>
        Effect.fail(new BadRequest({errors: ["We couldn't find this team"]})),
      ForbiddenActionError: () =>
        Effect.fail(new BadRequest({errors: ["We couldn't find this team"]})),
      InternalServerError: () => Effect.fail(new ServerError()),
      SessionNotFoundError: () =>
        LoaderArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
      UserNotFoundError: () =>
        LoaderArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
    })
  )
);

export type BaseOrgLoader = typeof loader;
