import {Outlet, useParams} from '@remix-run/react';

import {SubMenuLink} from '@/components/sub-menu-link';

function SettingsNav() {
  const {slug} = useParams();

  return (
    <div>
      <ul className="mb-10 flex space-x-2">
        <li>
          <SubMenuLink to={`/teams/${slug}/settings`} end>
            Index
          </SubMenuLink>
        </li>
        <li>
          <SubMenuLink to={`/teams/${slug}/settings/invitations`}>
            Invitations
          </SubMenuLink>
        </li>
        <li>
          <SubMenuLink to={`/teams/${slug}/settings/members`}>
            Members
          </SubMenuLink>
        </li>
        <li>
          <SubMenuLink to={`/teams/${slug}/settings/billing`}>
            Billing
          </SubMenuLink>
        </li>
      </ul>
    </div>
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
