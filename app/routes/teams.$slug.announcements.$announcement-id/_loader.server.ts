import * as Effect from 'effect/Effect';

import {pool} from '~/core/db/pool.server';
import {db} from '~/core/db/schema.server';
import {parseAnnouncementId} from '~/core/domain/announcement.server';
import {authenticateUser, identifyOrgByParams} from '~/core/lib/helpers.server';
import {
  BadRequest,
  Ok,
  Redirect,
  ServerError,
} from '~/core/lib/responses.server';
import {LoaderArgs, withLoader} from '~/core/lib/with-loader.server';
import {getAnnouncement} from '~/core/use-cases/get-announcement.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    const {request, params} = yield* _(LoaderArgs);

    const announcementId = yield* _(
      parseAnnouncementId(params['announcement-id'])
    );

    const userId = yield* _(authenticateUser(request));
    const orgId = yield* _(identifyOrgByParams(params));
    const announcement = yield* _(
      getAnnouncement({db, pool}).execute({announcementId, orgId, userId})
    );

    return new Ok({data: {announcement}});
  }).pipe(
    Effect.catchTags({
      OrgSlugParseError: () =>
        Effect.fail(new BadRequest({errors: ["We couldn't find this team"]})),
      OrgNotFoundError: () =>
        Effect.fail(new BadRequest({errors: ["We couldn't find this team"]})),
      ForbiddenActionError: () =>
        Effect.fail(
          new BadRequest({errors: ["We couldn't find this announcement"]})
        ),
      AnnouncementNotFoundError: () =>
        Effect.fail(
          new BadRequest({errors: ["We couldn't find this announcement"]})
        ),
      AnnouncementIdParseError: () => Effect.fail(new ServerError()),
      InternalServerError: () => Effect.fail(new ServerError()),
      SessionNotFoundError: () =>
        LoaderArgs.pipe(
          Effect.flatMap(({request}) =>
            Effect.fail(new Redirect({to: '/login', init: request}))
          )
        ),
    })
  )
);

export type AnnouncementLoaderData = typeof loader;
