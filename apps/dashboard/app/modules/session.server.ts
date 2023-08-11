import type {Request} from '@remix-run/node';
import {createCookieSessionStorage} from '@remix-run/node';
import {redirect} from 'remix-typedjson';
import zod from 'zod';

import {User} from '@/modules/domain/index.server';
import {getUser, whoAmI} from '@/modules/use-cases/index.server';
import {E} from '@/utils/fp';

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

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
}

// Full response, including memberships
export async function requireUser(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);

  const session = await getSession(request);
  const parsed = User.parseId(session.get(USER_SESSION_KEY));
  // No id, move to login
  if (E.isLeft(parsed)) {
    if (redirectTo && redirectTo !== '/') {
      // eslint-disable-next-line
      throw redirect(`/login?${searchParams.toString()}`);
    } else {
      // eslint-disable-next-line
      throw redirect(`/login`);
    }
  }
  const userId = parsed.right;

  const response = await whoAmI().execute(userId);
  // We have id, but no used (?!) - clear session
  if (E.isLeft(response)) {
    throw await logout(request);
  }

  return {
    currentUser: response.right,
  };
}

// Light response, ony user object
export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);

  const session = await getSession(request);
  const parsed = User.parseId(session.get(USER_SESSION_KEY));

  // No id, move to login
  if (E.isLeft(parsed)) {
    if (redirectTo && redirectTo !== '/') {
      throw redirect(`/login?${searchParams.toString()}`);
    } else {
      throw redirect(`/login`);
    }
  }

  const userId = parsed.right;

  const response = await getUser().execute(userId);
  // We have id, but no used (?!) - clear session
  if (E.isLeft(response)) {
    throw await logout(request);
  }

  return response.right.id;
}

export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo = '/',
}: {
  request: Request;
  userId: string;
  remember: boolean;
  redirectTo?: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect('/login', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
}
