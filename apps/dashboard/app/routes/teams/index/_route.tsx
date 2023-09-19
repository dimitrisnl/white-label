import type {MetaFunction} from '@remix-run/node';

import {ErrorPage} from '@/components/error-page';

export {loader} from './_loader.server';

export const meta: MetaFunction = () => {
  return [
    {title: 'Dashboard'},
    {name: 'description', content: 'Main dashboard'},
  ];
};

export function ErrorBoundary() {
  return <ErrorPage />;
}
