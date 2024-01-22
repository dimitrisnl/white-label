import type {LoaderFunctionArgs} from '@remix-run/node';
import * as Effect from 'effect/Effect';

import * as Org from '~/core/domain/org.server.ts';
import * as User from '~/core/domain/user.server.ts';
import {SessionNotFoundError} from '~/core/lib/errors.server';
import {getSession, USER_SESSION_KEY} from '~/core/lib/session.server';
import {getOrgIdBySlug} from '~/core/use-cases/get-org-id-by-slug.server';
import {getUser} from '~/core/use-cases/get-user.server';

type Params = LoaderFunctionArgs['params'];

export function identifyOrgByParams(params: Params) {
  return Effect.gen(function* (_) {
    const slug = yield* _(Org.parseSlug(params.slug));
    const orgId = yield* _(getOrgIdBySlug().execute(slug));

    return orgId;
  });
}

export function parseFormData(request: Request) {
  return Effect.gen(function* (_) {
    const formData = yield* _(Effect.promise(() => request.clone().formData()));
    return Object.fromEntries(formData);
  });
}

export function authenticateUser(request: Request) {
  return Effect.gen(function* (_) {
    const session = yield* _(getSession(request));
    const userId = yield* _(User.parseId(session.get(USER_SESSION_KEY)));
    const {user} = yield* _(getUser().execute(userId));

    return user;
  }).pipe(
    Effect.catchTags({
      ParseUserIdError: () => Effect.fail(new SessionNotFoundError()),
      UserNotFoundError: () => Effect.fail(new SessionNotFoundError()),
    })
  );
}
