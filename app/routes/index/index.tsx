import type {MetaFunction} from '@remix-run/node';

import {ErrorBox} from '~/components/error-boundary.tsx';

export {loader} from './_loader.server.ts';

export function ErrorBoundary() {
  return <ErrorBox />;
}

export const meta: MetaFunction = () => {
  return [
    {title: 'Dashboard'},
    {name: 'description', content: 'Main dashboard'},
  ];
};

export default function Page() {
  return null;
}
