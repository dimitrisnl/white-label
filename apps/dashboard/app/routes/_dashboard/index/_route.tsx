import type {V2_MetaFunction} from '@remix-run/node';

export {IndexPage as default, ErrorBoundary} from './index-page';

export const meta: V2_MetaFunction = () => {
  return [
    {title: 'Dashboard'},
    {name: 'description', content: 'Main dashboard'},
  ];
};

export {loader} from './loader.server';
