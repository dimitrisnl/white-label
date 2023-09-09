import * as Effect from 'effect/Effect';

import {Org} from '@/modules/domain/index.server';
import {
  BadRequest,
  Ok,
  Redirect,
  ServerError,
} from '@/modules/responses.server';
import {requireUser} from '@/modules/session.server';
import {getInvitations, getOrg} from '@/modules/use-cases/index.server';
import {LoaderArgs, withLoader} from '@/modules/with-loader.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    const {request, params} = yield* _(LoaderArgs);
    const orgId = yield* _(Org.parseId(params.orgId));
    const {currentUser} = yield* _(requireUser(request));

    const {org, memberships} = yield* _(
      getOrg().execute(orgId, currentUser.user.id)
    );
    const invitations = yield* _(
      getInvitations().execute(orgId, currentUser.user.id)
    );

    return new Ok({
      data: {org, memberships, invitations, currentUser},
    });
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError({})),
      SessionNotFoundError: () =>
        LoaderArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
      ValidationError: () =>
        Effect.fail(new BadRequest({errors: ["We couldn't find this team"]})),
      OrgNotFoundError: () =>
        Effect.fail(new BadRequest({errors: ["We couldn't find this team"]})),
      ForbiddenActionError: () =>
        Effect.fail(new BadRequest({errors: ["We couldn't find this team"]})),
    })
  )
);

export type GetOrgLoader = typeof loader;
