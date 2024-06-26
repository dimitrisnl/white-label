import type {LoaderFunctionArgs} from '@remix-run/node';
import * as Effect from 'effect/Effect';

import {pool} from '~/core/db/pool.server';
import {db} from '~/core/db/schema.server';
import {SessionNotFoundError} from '~/core/lib/errors.server';
import {getSession, USER_SESSION_KEY} from '~/core/lib/session.server';
import {getOrgIdBySlug} from '~/core/use-cases/get-org-id-by-slug.server';

import {parseOrgSlug} from '../domain/org.server';
import {parseUserId} from '../domain/user.server';

type Params = LoaderFunctionArgs['params'];

export function identifyOrgByParams(params: Params) {
  return Effect.gen(function* () {
    const slug = yield* parseOrgSlug(params.slug);
    const orgId = yield* getOrgIdBySlug({db, pool}).execute(slug);

    return orgId;
  });
}

export function parseFormData(request: Request) {
  return Effect.gen(function* () {
    const formData = yield* Effect.promise(() => request.clone().formData());
    return Object.fromEntries(formData);
  });
}

export function authenticateUser(request: Request) {
  return Effect.gen(function* () {
    const session = yield* getSession(request);
    const userId = yield* parseUserId(session.get(USER_SESSION_KEY));

    return userId;
  }).pipe(
    Effect.catchTags({
      UserIdParseError: () => Effect.fail(new SessionNotFoundError()),
    })
  );
}
