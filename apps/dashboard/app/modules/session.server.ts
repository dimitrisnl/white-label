import {createCookieSessionStorage} from '@remix-run/node';
import * as Effect from 'effect/Effect';
import zod from 'zod';

import {User} from '@/modules/domain/index.server';
import {getUser, whoAmI} from '@/modules/use-cases/index.server';

import {SessionNotFoundError} from './errors.server';
import {Redirect} from './responses.server';

const envValidationSchema = zod.object({
  SESSION_SECRET: zod.string().nonempty(),
});

// Throw on-load if missing
const config = envValidationSchema.parse(process.env);
const USER_SESSION_KEY = 'userId';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    path: '/',
    secrets: [config.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 0,
  },
});

export function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return Effect.promise(() => sessionStorage.getSession(cookie));
}

// Full response, including memberships
export function requireUser(request: Request) {
  return Effect.gen(function* (_) {
    const session = yield* _(getSession(request));
    const userId = yield* _(User.parseId(session.get(USER_SESSION_KEY)));
    const {user, memberships} = yield* _(whoAmI().execute(userId));

    return {
      currentUser: {user, memberships},
    };
  }).pipe(
    Effect.catchTags({
      ValidationError: () => Effect.fail(new SessionNotFoundError()),
      UserNotFoundError: () => Effect.fail(new SessionNotFoundError()),
    })
  );
}

// Light response, ony user object
export function requireUserId(request: Request) {
  return Effect.gen(function* (_) {
    const session = yield* _(getSession(request));
    const userId = yield* _(User.parseId(session.get(USER_SESSION_KEY)));
    const {user} = yield* _(getUser().execute(userId));

    return user.id;
  }).pipe(
    Effect.catchTags({
      ValidationError: () => Effect.fail(new SessionNotFoundError()),
      UserNotFoundError: () => Effect.fail(new SessionNotFoundError()),
    })
  );
}

export function logout(request: Request) {
  return Effect.gen(function* (_) {
    const session = yield* _(getSession(request));

    const cookie: string = yield* _(
      Effect.promise(() => sessionStorage.destroySession(session))
    );

    return new Redirect({
      to: '/login',
      init: {
        headers: {
          'Set-Cookie': cookie,
        },
      },
    });
  });
}

export function createUserSession({
  userId,
  remember = true,
  redirectToPath = '/',
  request,
}: {
  userId: string;
  remember: boolean;
  redirectToPath: string;
  request: Request;
}) {
  return Effect.gen(function* (_) {
    const session = yield* _(getSession(request));

    session.set(USER_SESSION_KEY, userId);

    const cookie: string = yield* _(
      Effect.promise(() =>
        sessionStorage.commitSession(session, {
          maxAge: remember
            ? 60 * 60 * 24 * 7 // 7 days
            : undefined,
        })
      )
    );

    return new Redirect({
      to: redirectToPath,
      init: {
        headers: {
          'Set-Cookie': cookie,
        },
      },
    });
  });
}
