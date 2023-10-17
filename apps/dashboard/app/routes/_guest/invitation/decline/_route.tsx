import {isRouteErrorResponse, useRouteError} from '@remix-run/react';

import {ErrorPage} from '@/components/error-page.tsx';

import {InvalidInvitationErrorMessage} from './invalid-invitation-error-message.tsx';
import {InvitationDeclineSuccessMessage} from './invitation-decline-success-message.tsx';

export {loader} from './_loader.server.ts';

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 500) {
      return <ErrorPage />;
    }

    return <InvalidInvitationErrorMessage />;
  }

  return <ErrorPage />;
}

export default function VerifyEmailPage() {
  return <InvitationDeclineSuccessMessage />;
}
