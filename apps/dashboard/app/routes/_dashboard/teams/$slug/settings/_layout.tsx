import {
  AdjustmentsHorizontalIcon,
  EnvelopeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import {Outlet, useParams} from '@remix-run/react';

import {SubMenuLink} from '~/components/sub-menu-link.tsx';

function SettingsNav() {
  const {slug} = useParams();

  return (
    <ul className="-m-4 mb-4 flex space-x-2 border-b px-4 py-4">
      <li>
        <SubMenuLink to={`/teams/${slug}/settings`} end>
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
          <div>Details</div>
        </SubMenuLink>
      </li>
      <li>
        <SubMenuLink to={`/teams/${slug}/settings/invitations`}>
          <EnvelopeIcon className="h-5 w-5" />
          <div>Invitations</div>
        </SubMenuLink>
      </li>
      <li>
        <SubMenuLink to={`/teams/${slug}/settings/members`}>
          <UsersIcon className="h-5 w-5" /> <div>Members</div>
        </SubMenuLink>
      </li>
    </ul>
  );
}

export default function SettingsLayout() {
  return (
    <div>
      <SettingsNav />
      <Outlet />
    </div>
  );
}
