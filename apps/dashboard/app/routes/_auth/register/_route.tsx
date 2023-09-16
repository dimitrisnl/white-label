import type {MetaFunction} from '@remix-run/node';

export {RegisterPage as default} from './register-page';

export {action} from './action.server';

export const meta: MetaFunction = () => {
  return [
    {title: 'Register'},
    {name: 'description', content: 'Register a new account'},
  ];
};
