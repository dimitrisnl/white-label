import {useLoaderData} from '@remix-run/react';

import {GuestLayout} from '@/components/layouts/guest-layout';

import {InvalidToken} from './invalid-token';
import type {ResetPasswordLoader} from './loader.server';
import {ResetPasswordForm} from './reset-password-form';

export function ResetPasswordPage() {
  const loaderData = useLoaderData<ResetPasswordLoader>();

  if (!loaderData.ok) {
    return (
      <GuestLayout>
        <InvalidToken />
      </GuestLayout>
    );
  }

  return (
    <GuestLayout>
      <ResetPasswordForm token={loaderData.data.token} />
    </GuestLayout>
  );
}
