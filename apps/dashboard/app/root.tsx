import '@white-label/ui-core/tailwind.css';
import './styles/fonts.css';
import './styles/nprogress.css';

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
import NProgress from 'nprogress';
import {useEffect} from 'react';

import {ErrorPage} from './components/error-page.tsx';

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
        <Toaster richColors position="top-right" closeButton={true} />
        <ScrollRestoration />
        <LiveReload />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return <ErrorPage />;
}
