import type {MetaFunction} from '@remix-run/node';
import {isRouteErrorResponse, useRouteError} from '@remix-run/react';
import {useTypedLoaderData} from 'remix-typedjson';

import {ErrorPage} from '@/components/error-page.tsx';
import {GuestLayout} from '@/components/guest-layout.tsx';

import type {ResetPasswordLoader} from './_loader.server.ts';
import {InvalidTokenErrorPage} from './invalid-token-error-page.tsx';
import {ResetPasswordForm} from './reset-password-form.tsx';

export {action} from './_action.server.ts';
export {loader} from './_loader.server.ts';

export const meta: MetaFunction = () => {
  return [
    {title: 'Reset Password'},
    {name: 'description', content: 'Set a new password'},
  ];
};

export default function ResetPasswordPage() {
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
