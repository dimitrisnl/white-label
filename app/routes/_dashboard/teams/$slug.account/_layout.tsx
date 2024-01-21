import {
  EnvelopeIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {Outlet, useParams} from '@remix-run/react';

import {BaseErrorBoundary} from '~/components/error-boundary.tsx';
import {SubMenu, SubMenuLink} from '~/components/sub-menu';

function SettingsNav() {
  const {slug} = useParams();

  return (
    <SubMenu>
      <SubMenuLink to={`/teams/${slug}/account`} end>
        <UserCircleIcon className="h-5 w-5" /> <div>Details</div>{' '}
      </SubMenuLink>
      <SubMenuLink to={`/teams/${slug}/account/security`}>
        <ShieldCheckIcon className="h-5 w-5" /> <div>Security</div>
      </SubMenuLink>
      <SubMenuLink to={`/teams/${slug}/account/invitations`}>
        <EnvelopeIcon className="h-5 w-5" /> <div>Invitations</div>
      </SubMenuLink>
    </SubMenu>
  );
}

export default function OrgLayout() {
  return (
    <div>
      <SettingsNav />
      <Outlet />
    </div>
  );
}
export const ErrorBoundary = BaseErrorBoundary;
