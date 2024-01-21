import {Outlet} from '@remix-run/react';

import {BaseLayout} from '~/components/base-layout.tsx';
import {BaseErrorBoundary} from '~/components/error-boundary.tsx';
import {TeamSelector} from '~/components/team-selector.tsx';

import {useOrgData} from './use-org-data.ts';

export {loader} from './_loader.server.ts';

export default function OrgLayout() {
  const {memberships} = useOrgData();
  return (
    <BaseLayout teamSelector={<TeamSelector memberships={memberships} />}>
      <Outlet />
    </BaseLayout>
  );
}
export const ErrorBoundary = BaseErrorBoundary;
