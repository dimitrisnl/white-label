import {useTypedLoaderData} from 'remix-typedjson';

import {GuestLayout} from '@/components/layouts/guest-layout';

import type {ResetPasswordLoader} from './loader.server';
import {ResetPasswordForm} from './reset-password-form';

export function ResetPasswordPage() {
  const loaderData = useTypedLoaderData<ResetPasswordLoader>();

  return (
    <GuestLayout>
      <ResetPasswordForm token={loaderData.data.token} />
    </GuestLayout>
  );
}
