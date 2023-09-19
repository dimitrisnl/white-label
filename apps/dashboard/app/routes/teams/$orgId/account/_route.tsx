import type {MetaFunction} from '@remix-run/node';
import {Outlet} from '@remix-run/react';

import {ErrorPage} from '@/components/error-page';
import {SubMenuLink} from '@/components/sub-menu-link';

export {loader} from './_loader.server';

export const meta: MetaFunction = () => {
  return [{title: 'Settings'}, {name: 'description', content: 'Settings page'}];
};

export default function SettingsLayout() {
  return (
    <div>
      <ul className="mb-6 flex space-x-2">
        <li>
          <SubMenuLink to={``} end>
            Profile
          </SubMenuLink>
        </li>
        <li>
          <SubMenuLink to={`security`}>Security</SubMenuLink>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}

export function ErrorBoundary() {
  return <ErrorPage />;
}
