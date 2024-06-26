import * as Schema from '@effect/schema/Schema';
import {createCookieSessionStorage} from '@remix-run/node';
import * as Effect from 'effect/Effect';

import {Redirect} from '~/core/lib/responses.server';

const envValidationSchema = Schema.Struct({
  SESSION_SECRET: Schema.String.pipe(Schema.nonEmpty()),
});

// Throw on-load if missing
const config = Schema.decodeUnknownSync(envValidationSchema)(process.env);
export const USER_SESSION_KEY = 'userId';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    path: '/',
    secrets: [config.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production', // add domain
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 0,
  },
});

export function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return Effect.promise(() => sessionStorage.getSession(cookie));
}

export function logout(request: Request) {
  return Effect.gen(function* () {
    const session = yield* getSession(request);

    const cookie: string = yield* Effect.promise(() =>
      sessionStorage.destroySession(session)
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
  return Effect.gen(function* () {
    yield* Effect.log(`Session: Creating user session ${userId}`);
    const session = yield* getSession(request);

    session.set(USER_SESSION_KEY, userId);

    const cookie: string = yield* Effect.promise(() =>
      sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      })
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
