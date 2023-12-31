import {isRouteErrorResponse, useRouteError} from '@remix-run/react';

import {ErrorPage} from '~/components/error-page.tsx';

import {InvalidTokenErrorMessage} from './invalid-token-error-message.tsx';
import {VerificationSuccessMessage} from './verification-success-message.tsx';

export {loader} from './_loader.server.ts';

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 500) {
      return <ErrorPage />;
    }

    return <InvalidTokenErrorMessage />;
  }

  return <ErrorPage />;
}

export default function VerifyEmailPage() {
  return <VerificationSuccessMessage />;
}
