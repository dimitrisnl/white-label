import type {MetaFunction} from '@remix-run/node';

import {GuestLayout} from '@/components/guest-layout.tsx';

import {RequestPasswordResetForm} from './request-password-reset-form.tsx';

export {action} from './_action.server.ts';

export const meta: MetaFunction = () => {
  return [
    {title: 'Request Password Reset'},
    {name: 'description', content: 'Request a password reset'},
  ];
};

export default function RequestPasswordReset() {
  return (
    <GuestLayout>
      <RequestPasswordResetForm />
    </GuestLayout>
  );
}
