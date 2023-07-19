import type {V2_MetaFunction} from '@remix-run/node';

export {LoginPage as default} from './login-page';

export {action} from './action.server';

export const meta: V2_MetaFunction = () => {
  return [
    {title: 'Login'},
    {name: 'description', content: 'Login to your account'},
  ];
};
