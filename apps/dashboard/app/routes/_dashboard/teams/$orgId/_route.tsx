import type {V2_MetaFunction} from '@remix-run/node';
import {isRouteErrorResponse, useRouteError} from '@remix-run/react';

import {ErrorPage} from '@/components/error-page';

export {TeamPage as default} from './team-page';

export const meta: V2_MetaFunction = () => {
  return [
    {title: 'Team'},
    {name: 'description', content: 'Team settings page'},
  ];
};

export {loader} from './loader.server';
export {action} from './action.server';

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 500) {
      return <ErrorPage />;
    }

    return (
      // eslint-disable-next-line
      <ErrorPage statusCode={error.status} messages={error.data?.errors} />
    );
  }

  return <ErrorPage />;
}
