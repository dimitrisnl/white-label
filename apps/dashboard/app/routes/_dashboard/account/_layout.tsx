import {
  EnvelopeIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {Outlet} from '@remix-run/react';

import {BaseLayout} from '~/components/base-layout.tsx';
import {BaseErrorBoundary} from '~/components/error-boundary.tsx';
import {MainNav} from '~/components/main-nav';

const navigationMenu = [
  {
    name: 'Profile',
    href: '/account',
    icon: UserCircleIcon,
    end: true,
  },
  {
    name: 'Security',
    href: '/account/security',
    icon: ShieldCheckIcon,
    end: false,
  },
  {
    name: 'Invitations',
    href: '/account/invitations',
    icon: EnvelopeIcon,
    end: false,
  },
];

export default function OrgLayout() {
  return (
    <BaseLayout navigationMenu={<MainNav navigationMenu={navigationMenu} />}>
      <Outlet />
    </BaseLayout>
  );
}
export const ErrorBoundary = BaseErrorBoundary;
