import type {MetaFunction} from '@remix-run/node';

import {GuestLayout} from '~/components/guest-layout.tsx';

import {RegisterForm} from './register-form.tsx';

export {action} from './_action.server.ts';

export const meta: MetaFunction = () => {
  return [
    {title: 'Register'},
    {name: 'description', content: 'Register a new account'},
  ];
};

export default function RegisterPage() {
  return (
    <GuestLayout>
      <RegisterForm />
    </GuestLayout>
  );
}
