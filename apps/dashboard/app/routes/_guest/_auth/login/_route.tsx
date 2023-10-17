import type {MetaFunction} from '@remix-run/node';

import {GuestLayout} from '@/components/guest-layout.tsx';

import {LoginForm} from './login-form.tsx';
import {PasswordResetBanner} from './password-reset-banner.tsx';

export {action} from './_action.server.ts';

export const meta: MetaFunction = () => {
  return [
    {title: 'Login'},
    {name: 'description', content: 'Login to your account'},
  ];
};

export default function LoginPage() {
  return (
    <GuestLayout>
      <PasswordResetBanner />
      <LoginForm />
    </GuestLayout>
  );
}
