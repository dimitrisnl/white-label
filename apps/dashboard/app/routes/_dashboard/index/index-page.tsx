import {useTypedLoaderData} from 'remix-typedjson';

import {BaseLayout} from '@/components/layouts/base-layout';

import type {IndexLoaderData} from './loader.server';

export function IndexPage() {
  const response = useTypedLoaderData<IndexLoaderData>();

  const {
    data: {currentUser},
  } = response;

  return (
    <BaseLayout title="Dashboard" currentUser={currentUser}>
      <div className="text-grey-600 flex h-32 items-center justify-center rounded border border-gray-200 bg-white p-4">
        Welcome, This is the main dashboard.
      </div>
    </BaseLayout>
  );
}
