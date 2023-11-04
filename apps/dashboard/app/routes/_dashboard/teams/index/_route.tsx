import type {MetaFunction} from '@remix-run/node';

import {ErrorPage} from '~/components/error-page.tsx';

export {loader} from './_loader.server.ts';
import {useTypedLoaderData} from 'remix-typedjson';

import type {TeamsIndexLoaderData} from './_loader.server.ts';
import {TeamsList} from './teams-list.tsx';

export const meta: MetaFunction = () => {
  return [{title: 'Dashboard'}, {name: 'description', content: 'All Teams'}];
};

export default function IndexPage() {
  const {
    data: {memberships},
  } = useTypedLoaderData<TeamsIndexLoaderData>();
  return <TeamsList memberships={memberships} />;
}

export function ErrorBoundary() {
  return <ErrorPage />;
}
