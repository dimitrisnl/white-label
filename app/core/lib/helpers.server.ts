import type {LoaderFunctionArgs} from '@remix-run/node';
import * as Effect from 'effect/Effect';

import {SessionNotFoundError} from '~/core/lib/errors.server';
import {getSession, USER_SESSION_KEY} from '~/core/lib/session.server';
import {getOrgIdBySlug} from '~/core/use-cases/get-org-id-by-slug.server';

import {parseOrgSlug} from '../domain/org.server';
import {parseUserId} from '../domain/user.server';

type Params = LoaderFunctionArgs['params'];

export function identifyOrgByParams(params: Params) {
  return Effect.gen(function* (_) {
    const slug = yield* _(parseOrgSlug(params.slug));
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
    const userId = yield* _(parseUserId(session.get(USER_SESSION_KEY)));

    return userId;
  }).pipe(
    Effect.catchTags({
      UserIdParseError: () => Effect.fail(new SessionNotFoundError()),
    })
  );
}
