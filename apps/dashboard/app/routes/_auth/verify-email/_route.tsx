import {isRouteErrorResponse, useRouteError} from '@remix-run/react';

import {ErrorPage} from '@/components/error-page';

import {InvalidTokenErrorPage} from './invalid-token-error-page';

export {VerifyEmailPage as default} from './verify-email-page';

export {loader} from './loader.server';

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 500) {
      return <ErrorPage />;
    }

    return <InvalidTokenErrorPage />;
  }

  return <ErrorPage />;
}
