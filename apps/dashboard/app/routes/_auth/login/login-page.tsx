import {useSearchParams} from '@remix-run/react';
import {Alert, AlertDescription, AlertTitle} from '@white-label/ui-core';

import {GuestLayout} from '@/components/layouts/guest-layout';

import {LoginForm} from './login-form';

function Banner() {
  const [params] = useSearchParams();

  if (params.get('resetPassword') === 'true') {
    return (
      <div className="mb-4">
        <Alert variant="success">
          <AlertTitle>Your password has been reset successfully!</AlertTitle>
          <AlertDescription>
            You can now log in with your new password.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
}

export function LoginPage() {
  return (
    <GuestLayout>
      <Banner />
      <LoginForm />
    </GuestLayout>
  );
}
