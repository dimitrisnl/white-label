import {Outlet, useParams} from '@remix-run/react';

import {BaseLayout} from '@/components/base-layout';
import {BaseErrorBoundary} from '@/components/error-boundary';

import {useOrgData} from './use-org-data';

export {loader} from './_loader.server';

import {
  CogIcon,
  GlobeAltIcon,
  HomeIcon,
  PresentationChartBarIcon,
} from '@heroicons/react/24/outline';

export default function OrgLayout() {
  const {currentUser} = useOrgData();
  const {slug} = useParams();

  const navigationMenu = [
    {name: 'Home', href: '', icon: HomeIcon, end: true},
    {
      name: 'Feature A',
      href: `/teams/${slug}/feature-a`,
      icon: GlobeAltIcon,
      end: false,
    },
    {
      name: 'Feature B',
      href: `/teams/${slug}/feature-b`,
      icon: PresentationChartBarIcon,
      end: false,
    },
    {
      name: 'Settings',
      href: `/teams/${slug}/settings`,
      icon: CogIcon,
      end: false,
    },
  ];

  return (
    <BaseLayout currentUser={currentUser} navigationMenu={navigationMenu}>
      <Outlet />
    </BaseLayout>
  );
}
export const ErrorBoundary = BaseErrorBoundary;
