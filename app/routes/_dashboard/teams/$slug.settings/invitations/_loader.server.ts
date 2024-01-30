import * as Effect from 'effect/Effect';

import {authenticateUser, identifyOrgByParams} from '~/core/lib/helpers.server';
import {
  BadRequest,
  Ok,
  Redirect,
  ServerError,
} from '~/core/lib/responses.server';
import {LoaderArgs, withLoader} from '~/core/lib/with-loader.server';
import {getOrgInvitations} from '~/core/use-cases/get-org-invitations.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    yield* _(
      Effect.log('Loader(_dashboard/teams/$slug/settings/invitations): Init')
    );
    const {request, params} = yield* _(LoaderArgs);

    const userId = yield* _(authenticateUser(request));
    const orgId = yield* _(identifyOrgByParams(params));

    const allInvitations = yield* _(getOrgInvitations().execute(orgId, userId));
    const invitations = allInvitations.filter(
      ({status}) => status !== 'ACCEPTED'
    );

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
