import {useLoaderData} from '@remix-run/react';

import {BaseLayout} from '@/components/layouts/base-layout';

import type {GetOrgLoader} from './loader.server';
import {TeamInfo} from './team-info';
import {TeamInvitations} from './team-invitations';
import {Invitees, TeamList} from './team-list';

export function TeamPage() {
  const {data} = useLoaderData<GetOrgLoader>();

  return (
    <BaseLayout title="Team">
      <div className="grid grid-cols-1 items-start gap-8">
        <div className="grid grid-cols-2 items-start gap-8">
          <TeamInfo initialName={data.org.name} />
          <TeamInvitations />
        </div>

        <TeamList users={data.users} />
        <Invitees invitations={data.invitations} />
      </div>
    </BaseLayout>
  );
}
