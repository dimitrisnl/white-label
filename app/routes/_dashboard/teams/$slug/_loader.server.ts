import * as Effect from 'effect/Effect';

import {authenticateUser, identifyOrgByParams} from '~/core/lib/helpers.server';
import {
  BadRequest,
  Ok,
  Redirect,
  ServerError,
} from '~/core/lib/responses.server';
import {LoaderArgs, withLoader} from '~/core/lib/with-loader.server';
import {getOrg} from '~/core/use-cases/get-org.server';
import {getUserMemberships} from '~/core/use-cases/get-user-memberships.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Loader(_dashboard/teams/$slug/_layout): Init'));
    const {request, params} = yield* _(LoaderArgs);

    const user = yield* _(authenticateUser(request));
    const orgId = yield* _(identifyOrgByParams(params));
    const org = yield* _(getOrg().execute(orgId, user.id));
    const {memberships} = yield* _(getUserMemberships().execute(user.id));

    return new Ok({data: {org, memberships, user}});
  }).pipe(
    Effect.catchTags({
      ParseOrgSlugError: () =>
        Effect.fail(new BadRequest({errors: ["We couldn't find this team"]})),
      OrgNotFoundError: () =>
        Effect.fail(new BadRequest({errors: ["We couldn't find this team"]})),
      ForbiddenActionError: () =>
        Effect.fail(new BadRequest({errors: ["We couldn't find this team"]})),
      InternalServerError: () => Effect.fail(new ServerError({})),
      SessionNotFoundError: () =>
        LoaderArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
    })
  )
);

export type BaseOrgLoader = typeof loader;
