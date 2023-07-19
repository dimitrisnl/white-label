import {GuestLayout} from '@/components/layouts/guest-layout';

import {LoginForm} from './login-form';

export function LoginPage() {
  return (
    <GuestLayout>
      <LoginForm />
    </GuestLayout>
  );
}
