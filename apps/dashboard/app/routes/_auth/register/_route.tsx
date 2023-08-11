import type {V2_MetaFunction} from '@remix-run/node';

export {RegisterPage as default} from './register-page';

export {action} from './action.server';

export const meta: V2_MetaFunction = () => {
  return [
    {title: 'Register'},
    {name: 'description', content: 'Register a new account'},
  ];
};
