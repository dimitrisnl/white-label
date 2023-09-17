import type {MetaFunction} from '@remix-run/node';
import {Outlet} from '@remix-run/react';

import {BaseLayout} from '@/components/base-layout';
import {ErrorPage} from '@/components/error-page';
import {SubMenuLink} from '@/components/sub-menu-link';

import {useSettingsData} from './use-settings-data';

export {loader} from './_loader.server';

export const meta: MetaFunction = () => {
  return [{title: 'Settings'}, {name: 'description', content: 'Settings page'}];
};

export default function SettingsLayout() {
  const {currentUser} = useSettingsData();

  return (
    <BaseLayout
      title="Settings"
      currentUser={currentUser}
      subMenu={
        <ul className="flex space-x-2">
          <li>
            <SubMenuLink to={`/settings`} end>
              Profile
            </SubMenuLink>
          </li>
          <li>
            <SubMenuLink to={`/settings/security`}>Security</SubMenuLink>
          </li>
        </ul>
      }
    >
      <Outlet />
    </BaseLayout>
  );
}

export function ErrorBoundary() {
  return <ErrorPage />;
}
