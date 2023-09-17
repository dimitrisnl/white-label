import type {MetaFunction} from '@remix-run/node';
import {useTypedLoaderData} from 'remix-typedjson';

import {BaseLayout} from '@/components/base-layout';
import {ErrorPage} from '@/components/error-page';

import {IndexLoaderData} from './_loader.server';
import {AllTeams} from './index-page';

export {loader} from './_loader.server';

export const meta: MetaFunction = () => {
  return [
    {title: 'Dashboard'},
    {name: 'description', content: 'Main dashboard'},
  ];
};

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function IndexPage() {
  const response = useTypedLoaderData<IndexLoaderData>();

  const {
    data: {currentUser},
  } = response;

  return (
    <BaseLayout title="All Teams" currentUser={currentUser}>
      <AllTeams currentUser={currentUser} />
    </BaseLayout>
  );
}
