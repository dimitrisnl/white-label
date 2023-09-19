import {Outlet, useParams} from '@remix-run/react';

import {BaseLayout} from '@/components/base-layout';
import {SubMenuLink} from '@/components/sub-menu-link';

import {useOrgData} from './use-org-data';

export {loader} from './_loader.server';

export default function OrgLayout() {
  const {currentUser, org} = useOrgData();
  const {orgId} = useParams();

  return (
    <BaseLayout
      title={org.name}
      currentUser={currentUser}
      subMenu={
        <ul className="flex space-x-2">
          <li>
            <SubMenuLink to={`/teams/${orgId}`} end>
              Index
            </SubMenuLink>
          </li>
          <li>
            <SubMenuLink to={`/teams/${orgId}/invitations`}>
              Invitations
            </SubMenuLink>
          </li>
          <li>
            <SubMenuLink to={`/teams/${orgId}/members`}>Members</SubMenuLink>
          </li>
          <li>
            <SubMenuLink to={`/teams/${orgId}/billing`}>Billing</SubMenuLink>
          </li>
          <li>
            <SubMenuLink to={`/teams/${orgId}/account`}>Account</SubMenuLink>
          </li>
        </ul>
      }
    >
      <Outlet />
    </BaseLayout>
  );
}
