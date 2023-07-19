import type {V2_MetaFunction} from '@remix-run/node';

export {TeamPage as default} from './team-page';

export const meta: V2_MetaFunction = () => {
  return [
    {title: 'Team'},
    {name: 'description', content: 'Team settings page'},
  ];
};

export {loader} from './loader.server';
export {action} from './action.server';
