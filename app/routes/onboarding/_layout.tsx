import {Outlet} from '@remix-run/react';

import {GenericLayout} from '~/components/guest-layout.tsx';

export default function OnboardingLayout() {
  return (
    <GenericLayout>
      <Outlet />
    </GenericLayout>
  );
}
