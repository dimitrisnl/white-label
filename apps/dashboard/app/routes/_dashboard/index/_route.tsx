import type {MetaFunction} from '@remix-run/node';

export {IndexPage as default, ErrorBoundary} from './index-page';

export const meta: MetaFunction = () => {
  return [
    {title: 'Dashboard'},
    {name: 'description', content: 'Main dashboard'},
  ];
};

export {loader} from './loader.server';
