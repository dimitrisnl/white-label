import {BaseLayout} from '@/components/layouts/base-layout';

export function IndexPage() {
  return (
    <BaseLayout title="Dashboard">
      <div className="text-grey-600 flex h-32 items-center justify-center rounded border border-gray-200 bg-white p-4">
        Welcome, This is the main dashboard.
      </div>
    </BaseLayout>
  );
}
