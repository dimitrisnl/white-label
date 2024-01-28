import {Outlet} from '@remix-run/react';

import {BaseLayout} from '~/components/base-layout.tsx';
import {BaseErrorBoundary} from '~/components/error-boundary.tsx';
import {TeamSelector} from '~/components/team-selector.tsx';

import {useMetadata} from './use-metadata-data.ts';

export {loader} from './_loader.server.ts';

export default function OrgLayout() {
  const {memberships, user} = useMetadata();
  return (
    <BaseLayout
      teamSelector={<TeamSelector memberships={memberships} />}
      user={user}
    >
      <Outlet />
    </BaseLayout>
  );
}
export const ErrorBoundary = BaseErrorBoundary;
