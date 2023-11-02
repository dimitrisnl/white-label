import type {MetaFunction} from '@remix-run/node';

import {ErrorPage} from '~/components/error-page.tsx';

export {loader} from './_loader.server.ts';

export const meta: MetaFunction = () => {
  return [
    {title: 'Dashboard'},
    {name: 'description', content: 'Main dashboard'},
  ];
};

export function ErrorBoundary() {
  return <ErrorPage />;
}
