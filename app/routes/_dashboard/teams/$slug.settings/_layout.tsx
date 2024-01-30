import {
  AdjustmentsHorizontalIcon,
  EnvelopeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import {Outlet, useParams} from '@remix-run/react';

import {SubMenu, SubMenuLink} from '~/components/sub-menu';

function Nav() {
  const {slug} = useParams();

  return (
    <SubMenu>
      <SubMenuLink to={`/teams/${slug}/settings`} end>
        <AdjustmentsHorizontalIcon className="h-5 w-5" />
        <div>Details</div>
      </SubMenuLink>

      <SubMenuLink to={`/teams/${slug}/settings/invitations`}>
        <EnvelopeIcon className="h-5 w-5" />
        <div>Invitations</div>
      </SubMenuLink>

      <SubMenuLink to={`/teams/${slug}/settings/members`}>
        <UsersIcon className="h-5 w-5" /> <div>Members</div>
      </SubMenuLink>
    </SubMenu>
  );
}

export default function Layout() {
  return (
    <div>
      <Nav />
      <Outlet />
    </div>
  );
}
