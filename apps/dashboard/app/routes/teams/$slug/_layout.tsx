import {Outlet} from '@remix-run/react';

import {BaseLayout} from '@/components/base-layout';
import {BaseErrorBoundary} from '@/components/error-boundary';

import {useOrgData} from './use-org-data';

export {loader} from './_loader.server';

export default function OrgLayout() {
  const {currentUser} = useOrgData();

  return (
    <BaseLayout currentUser={currentUser}>
      <Outlet />
    </BaseLayout>
  );
}
export const ErrorBoundary = BaseErrorBoundary;
