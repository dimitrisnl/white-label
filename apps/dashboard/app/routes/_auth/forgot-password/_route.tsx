import type {MetaFunction} from '@remix-run/node';
export {ForgotPasswordPage as default} from './forgot-password-page';

export const meta: MetaFunction = () => {
  return [
    {title: 'Reset Password'},
    {name: 'description', content: 'Request a password reset'},
  ];
};

export {action} from './action.server';
