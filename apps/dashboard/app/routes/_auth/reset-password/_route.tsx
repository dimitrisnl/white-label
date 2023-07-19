import type {V2_MetaFunction} from '@remix-run/node';

export {ResetPasswordPage as default} from './reset-password-page';

export const meta: V2_MetaFunction = () => {
  return [
    {title: 'Reset Password'},
    {name: 'description', content: 'Set a new password'},
  ];
};

export {action} from './action.server';
export {loader} from './loader.server';
