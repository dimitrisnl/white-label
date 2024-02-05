import {isRouteErrorResponse, useRouteError} from '@remix-run/react';

import {ErrorBox} from '~/components/error-boundary.tsx';

import {InvalidInvitationErrorMessage} from './invalid-invitation-error-message.tsx';
import {InvitationDeclineSuccessMessage} from './invitation-decline-success-message.tsx';

export {loader} from './_loader.server.ts';

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 500) {
      return <ErrorBox />;
    }

    return <InvalidInvitationErrorMessage />;
  }

  return <ErrorBox />;
}

export default function VerifyEmailPage() {
  return <InvitationDeclineSuccessMessage />;
}
