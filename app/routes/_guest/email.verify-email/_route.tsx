import {isRouteErrorResponse, useRouteError} from '@remix-run/react';

import {ErrorBox} from '~/components/error-boundary.tsx';

import {InvalidTokenErrorMessage} from './invalid-token-error-message.tsx';
import {VerificationSuccessMessage} from './verification-success-message.tsx';

export {loader} from './_loader.server.ts';

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 500) {
      return <ErrorBox />;
    }

    return <InvalidTokenErrorMessage />;
  }

  return <ErrorBox />;
}

export default function VerifyEmailPage() {
  return <VerificationSuccessMessage />;
}
