import {
  EnvelopeIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {Outlet} from '@remix-run/react';

import {BaseLayout} from '@/components/base-layout';
import {BaseErrorBoundary} from '@/components/error-boundary';

import {useAccountData} from './use-account-data';

export {loader} from './_loader.server';

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
  const {currentUser} = useAccountData();

  return (
    <BaseLayout currentUser={currentUser} navigationMenu={navigationMenu}>
      <Outlet />
    </BaseLayout>
  );
}
export const ErrorBoundary = BaseErrorBoundary;
