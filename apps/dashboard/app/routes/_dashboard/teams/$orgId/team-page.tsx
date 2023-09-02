import {useTypedLoaderData} from 'remix-typedjson';

import {BaseLayout} from '@/components/layouts/base-layout';

import type {GetOrgLoader} from './loader.server';
import {TeamInfo} from './team-info';
import {TeamInvitations} from './team-invitations';
import {Invitees, TeamList} from './team-list';

export function TeamPage() {
  const {
    data: {currentUser, org, memberships, invitations},
  } = useTypedLoaderData<GetOrgLoader>();

  return (
    <BaseLayout title={org.name} currentUser={currentUser}>
      <div className="grid grid-cols-1 items-start gap-8">
        <div className="grid grid-cols-2 items-start gap-8">
          <TeamInfo initialName={org.name} />
          <TeamInvitations />
        </div>

        <div className="grid grid-cols-2 items-start gap-8">
          <TeamList memberships={memberships} />
          <Invitees invitations={invitations} />
        </div>
      </div>
    </BaseLayout>
  );
}
