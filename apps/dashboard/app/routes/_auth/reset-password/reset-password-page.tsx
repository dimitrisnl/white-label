import {useLoaderData} from '@remix-run/react';

import {GuestLayout} from '@/components/layouts/guest-layout';

import {InvalidToken} from './invalid-token';
import {ResetPasswordForm} from './reset-password-form';

export function ResetPasswordPage() {
  const {ok, token} = useLoaderData();

  if (!ok) {
    return (
      <GuestLayout>
        <InvalidToken />
      </GuestLayout>
    );
  }

  return (
    <GuestLayout>
      <ResetPasswordForm token={token} />
    </GuestLayout>
  );
}
