import {useTypedLoaderData} from 'remix-typedjson';

import {BaseLayout} from '@/components/layouts/base-layout';

import type {IndexLoaderData} from './loader.server';

export function IndexPage() {
  const {
    data: {currentUser},
  } = useTypedLoaderData<IndexLoaderData>();

  return (
    <BaseLayout title="Dashboard" user={currentUser.user}>
      <div className="text-grey-600 flex h-32 items-center justify-center rounded border border-gray-200 bg-white p-4">
        Welcome, This is the main dashboard.
      </div>
    </BaseLayout>
  );
}
