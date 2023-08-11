import {useTypedLoaderData} from 'remix-typedjson';

import {BaseLayout} from '@/components/layouts/base-layout';

import type {GetOrgLoader} from './loader.server';
import {TeamInfo} from './team-info';
import {TeamInvitations} from './team-invitations';
import {Invitees, TeamList} from './team-list';

export function TeamPage() {
  const response = useTypedLoaderData<GetOrgLoader>();

  // todo: handle this
  if (!response.ok) {
    return <div>An error occured</div>;
  }

  const {data} = response;

  return (
    <BaseLayout title="Team" user={data.currentUser.user}>
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
