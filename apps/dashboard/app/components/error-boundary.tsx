import {isRouteErrorResponse, useRouteError} from '@remix-run/react';

import {ErrorPage} from './error-page';

export function BaseErrorBoundary() {
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
