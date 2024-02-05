import type {MetaFunction} from '@remix-run/node';

import {GenericLayout} from '~/components/guest-layout.tsx';

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
    <GenericLayout>
      <RequestPasswordResetForm />
    </GenericLayout>
  );
}
