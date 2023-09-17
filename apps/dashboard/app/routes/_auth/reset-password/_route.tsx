import type {MetaFunction} from '@remix-run/node';
import {isRouteErrorResponse, useRouteError} from '@remix-run/react';
import {useTypedLoaderData} from 'remix-typedjson';

import {ErrorPage} from '@/components/error-page';
import {GuestLayout} from '@/components/guest-layout';

import {ResetPasswordLoader} from './_loader.server';
import {InvalidTokenErrorPage} from './invalid-token-error-page';
import {ResetPasswordForm} from './reset-password-form';

export {action} from './_action.server';
export {loader} from './_loader.server';

export const meta: MetaFunction = () => {
  return [
    {title: 'Reset Password'},
    {name: 'description', content: 'Set a new password'},
  ];
};

export function ResetPasswordPage() {
  const loaderData = useTypedLoaderData<ResetPasswordLoader>();

  return (
    <GuestLayout>
      <ResetPasswordForm token={loaderData.data.token} />
    </GuestLayout>
  );
}

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
