import {useLoaderData} from '@remix-run/react';

import {BaseLayout} from '@/components/layouts/base-layout';

import {TeamInfo} from './team-info';
import {TeamInvitations} from './team-invitations';
import {TeamList} from './team-list';

export function TeamPage() {
  const {org, users} = useLoaderData();
  return (
    <BaseLayout title="Team">
      <div className="grid grid-cols-1 items-start gap-8">
        <div className="grid grid-cols-2 items-start gap-8">
          <TeamInfo initialName={org.name} />
          <TeamInvitations />
        </div>

        <TeamList users={users} />
      </div>
    </BaseLayout>
  );
}
