import type {MetaFunction} from '@remix-run/node';

import {GuestLayout} from '@/components/guest-layout';

import {LoginForm} from './login-form';
import {PasswordResetBanner} from './password-reset-banner';

export {action} from './_action.server';

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
