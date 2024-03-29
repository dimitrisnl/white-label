import './styles/tailwind.css';
import './styles/fonts.css';
import './styles/nprogress.css';

import type {LoaderFunctionArgs} from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
} from '@remix-run/react';
import clsx from 'clsx';
import NProgress from 'nprogress';
import {useEffect} from 'react';
import {PreventFlashOnWrongTheme, ThemeProvider, useTheme} from 'remix-themes';

import {ErrorBox} from './components/error-boundary.tsx';
import {GenericLayout} from './components/guest-layout.tsx';
import {Toaster} from './components/ui/toast.tsx';
import {themeSessionResolver} from './core/lib/theme.server.ts';

export async function loader({request}: LoaderFunctionArgs) {
  const {getTheme} = await themeSessionResolver(request);
  return {
    theme: getTheme(),
  };
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/set-theme">
      <App />
    </ThemeProvider>
  );
}

export function App() {
  const navigation = useNavigation();
  const [theme] = useTheme();
  const data = useLoaderData<typeof loader>();

  useEffect(() => {
    if (navigation.state === 'idle') NProgress.done();
    else NProgress.start();
  }, [navigation.state]);

  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body>
        <Outlet />
        <Toaster richColors position="top-right" closeButton={true} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <GenericLayout>
      <ErrorBox />
    </GenericLayout>
  );
}
