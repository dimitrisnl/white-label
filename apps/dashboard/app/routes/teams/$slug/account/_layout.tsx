import {Outlet} from '@remix-run/react';

import {SubMenuLink} from '@/components/sub-menu-link';

export {loader} from './_loader.server';

function AccountNav() {
  return (
    <ul className="mb-10 flex space-x-2">
      <li>
        <SubMenuLink to={``} end>
          Profile
        </SubMenuLink>
      </li>
      <li>
        <SubMenuLink to={`security`}>Security</SubMenuLink>
      </li>
    </ul>
  );
}

export default function AccountLayout() {
  return (
    <div>
      <AccountNav />
      <Outlet />
    </div>
  );
}
