import type {Request, V2_MetaFunction} from '@remix-run/node';

import {requireToken} from '@/lib/session';

import {IndexPage} from './index-page';

export const meta: V2_MetaFunction = () => {
  return [
    {title: 'Dashboard'},
    {name: 'description', content: 'Main dashboard'},
  ];
};

export function loader({request}: {request: Request}) {
  return requireToken(request);
}

export default function Index() {
  return <IndexPage />;
}
