import type {LinksFunction} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from '@remix-run/react';
import {Toaster} from '@white-label/ui-core/toast';
import tailwindStyles from '@white-label/ui-core/tailwind.css';
import NProgress from 'nprogress';
import {useEffect} from 'react';

import {ErrorPage} from './components/error-page.tsx';
import fontStyles from './styles/fonts.css';
import nProgressStyles from './styles/nprogress.css';

export const links: LinksFunction = () => [
  {rel: 'stylesheet', href: fontStyles},
  {rel: 'stylesheet', href: tailwindStyles},
  {rel: 'stylesheet', href: nProgressStyles},
];

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
        <Toaster richColors position="top-right" closeButton={true} />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return <ErrorPage />;
}
