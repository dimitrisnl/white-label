import type {MetaFunction} from '@remix-run/node';
import {isRouteErrorResponse, useRouteError} from '@remix-run/react';

import {ErrorPage} from '@/components/error-page';

import {InvalidTokenErrorPage} from './invalid-token-error-page';

export {ResetPasswordPage as default} from './reset-password-page';

export const meta: MetaFunction = () => {
  return [
    {title: 'Reset Password'},
    {name: 'description', content: 'Set a new password'},
  ];
};

export {action} from './action.server';
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
