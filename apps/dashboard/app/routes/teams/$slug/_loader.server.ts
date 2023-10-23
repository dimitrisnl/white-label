import * as Effect from 'effect/Effect';

import {
  getCurrentUserDetails,
  identifyOrgByParams,
} from '@/modules/helpers.server.ts';
import {
  BadRequest,
  Ok,
  Redirect,
  ServerError,
} from '@/modules/responses.server.ts';
import {getOrg} from '@/modules/use-cases/index.server.ts';
import {LoaderArgs, withLoader} from '@/modules/with-loader.server.ts';

export const loader = withLoader(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Loader(teams/$slug/_layout): Init'));
    const {request, params} = yield* _(LoaderArgs);

    const currentUser = yield* _(getCurrentUserDetails(request));
    const orgId = yield* _(identifyOrgByParams(params));
    const org = yield* _(getOrg().execute(orgId, currentUser.user.id));

    return new Ok({data: {org, currentUser}});
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
