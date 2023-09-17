import type {MetaFunction} from '@remix-run/node';

import {GuestLayout} from '@/components/guest-layout';

import {ForgotPasswordForm} from './forgot-password-form';

export {action} from './_action.server';

export const meta: MetaFunction = () => {
  return [
    {title: 'Reset Password'},
    {name: 'description', content: 'Request a password reset'},
  ];
};

export default function ForgotPasswordPage() {
  return (
    <GuestLayout>
      <ForgotPasswordForm />
    </GuestLayout>
  );
}
