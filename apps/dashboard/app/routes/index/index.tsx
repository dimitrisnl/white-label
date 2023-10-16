import type {MetaFunction} from '@remix-run/node';

import {ErrorPage} from '@/components/error-page';

export {loader} from './_loader.server';

export function ErrorBoundary() {
  return <ErrorPage />;
}

export const meta: MetaFunction = () => {
  return [
    {title: 'Dashboard'},
    {name: 'description', content: 'Main dashboard'},
  ];
};
