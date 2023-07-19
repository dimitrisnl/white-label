import type {V2_MetaFunction} from '@remix-run/node';

import {GuestLayout} from '@/components/layouts/guest-layout';

import {ForgotPasswordForm} from './forgot-password-form';

export function ForgotPasswordPage() {
  return (
    <GuestLayout>
      <ForgotPasswordForm />
    </GuestLayout>
  );
}

export const meta: V2_MetaFunction = () => {
  return [
    {title: 'Reset Password'},
    {name: 'description', content: 'Request a password reset'},
  ];
};

export {action} from './action.server';
