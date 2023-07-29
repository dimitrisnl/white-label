import type {Request} from '@remix-run/node';
import {createCookieSessionStorage, redirect} from '@remix-run/node';

import {logout as logoutFromServer, me} from '@/lib/client';

const SESSION_SECRET = process.env.SESSION_SECRET!;
const SESSION_KEY = 'token';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    path: '/',
    secrets: [SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
}

export async function logout(request: Request) {
  const session = await getSession(request);
  const token = session.get(SESSION_KEY);

  if (!token) {
    return redirect('/login', {
      headers: {
        'Set-Cookie': await sessionStorage.destroySession(session),
      },
    });
  }

  try {
    await logoutFromServer(token);
  } catch (error) {
    console.error(error);
  }

  return redirect('/login', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
}

export async function createUserSession({
  request,
  token,
}: {
  request: Request;
  token: string;
}) {
  const session = await getSession(request);
  session.set(SESSION_KEY, token);
  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }),
    },
  });
}

export async function getAccessToken(request: Request) {
  const session = await getSession(request);
  return session.get(SESSION_KEY);
}

export async function getUser(request: Request) {
  const accessToken = await getAccessToken(request);

  if (!accessToken) {
    return null;
  }

  try {
    const data = await me(accessToken);
    const user = data.data;
    return user;
  } catch (error) {
    throw await logout(request);
  }
}

export async function requireToken(request: Request): Promise<string> {
  const token = await getAccessToken(request);
  if (!token) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw redirect('/login');
  }
  return token;
}
