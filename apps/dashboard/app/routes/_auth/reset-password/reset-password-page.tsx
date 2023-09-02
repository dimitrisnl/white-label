import {useTypedLoaderData} from 'remix-typedjson';

import {GuestLayout} from '@/components/layouts/guest-layout';

import {InvalidToken} from './invalid-token';
import type {ResetPasswordLoader} from './loader.server';
import {ResetPasswordForm} from './reset-password-form';

export function ResetPasswordPage() {
  const loaderData = useTypedLoaderData<ResetPasswordLoader>();

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
