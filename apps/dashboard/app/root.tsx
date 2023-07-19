import type {LinksFunction, Request} from '@remix-run/node';
import {json} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from '@remix-run/react';
import NProgress from 'nprogress';
import {useEffect} from 'react';
import {Toaster} from 'ui-core';
import tailwindStyles from 'ui-core/tailwind.css';

import {getUser} from './lib/session';
import fontStyles from './styles/fonts.css';
import nProgressStyles from './styles/nprogress.css';

export const links: LinksFunction = () => [
  {rel: 'stylesheet', href: fontStyles},
  {rel: 'stylesheet', href: tailwindStyles},
  {rel: 'stylesheet', href: nProgressStyles},
];

export async function loader({request}: {request: Request}) {
  return json({
    user: await getUser(request),
  });
}

export default function App() {
  const navigation = useNavigation();
  useEffect(() => {
    if (navigation.state === 'idle') NProgress.done();
    else NProgress.start();
  }, [navigation.state]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Toaster />
      </body>
    </html>
  );
}
