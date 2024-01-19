import {
  EnvelopeIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {Outlet, useParams} from '@remix-run/react';

import {BaseErrorBoundary} from '~/components/error-boundary.tsx';
import {SubMenuLink} from '~/components/sub-menu-link';

function SettingsNav() {
  const {slug} = useParams();

  return (
    <ul className="-m-4 mb-4 flex space-x-2 border-b px-4 py-4">
      <li>
        <SubMenuLink to={`/teams/${slug}/account`} end>
          <UserCircleIcon className="h-5 w-5" /> <div>Details</div>{' '}
        </SubMenuLink>
      </li>
      <li>
        <SubMenuLink to={`/teams/${slug}/account/security`}>
          <ShieldCheckIcon className="h-5 w-5" /> <div>Security</div>
        </SubMenuLink>
      </li>
      <li>
        <SubMenuLink to={`/teams/${slug}/account/invitations`}>
          <EnvelopeIcon className="h-5 w-5" /> <div>Invitations</div>
        </SubMenuLink>
      </li>
    </ul>
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
