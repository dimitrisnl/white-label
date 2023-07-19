import type {V2_MetaFunction} from '@remix-run/node';

import {GuestLayout} from '@/components/layouts/guest-layout';

import {RegisterForm} from './register-form';

export {action} from './action.server';

export function RegisterPage() {
  return (
    <GuestLayout>
      <RegisterForm />
    </GuestLayout>
  );
}

export const meta: V2_MetaFunction = () => {
  return [
    {title: 'Register'},
    {name: 'description', content: 'Register a new account'},
  ];
};
