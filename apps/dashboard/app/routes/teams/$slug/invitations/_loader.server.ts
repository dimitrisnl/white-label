import * as Effect from 'effect/Effect';

import {getCurrentUserId, identifyOrgByParams} from '@/modules/helpers.server';
import {
  BadRequest,
  Ok,
  Redirect,
  ServerError,
} from '@/modules/responses.server';
import {getOrgInvitations} from '@/modules/use-cases/index.server';
import {LoaderArgs, withLoader} from '@/modules/with-loader.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    const {request, params} = yield* _(LoaderArgs);

    const userId = yield* _(getCurrentUserId(request));
    const orgId = yield* _(identifyOrgByParams(params));

    const invitations = yield* _(getOrgInvitations().execute(orgId, userId));

    return new Ok({data: {invitations}});
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

export type InvitationsLoaderData = typeof loader;