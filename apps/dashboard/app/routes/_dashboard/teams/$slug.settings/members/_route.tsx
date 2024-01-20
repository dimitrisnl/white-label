import {useTypedLoaderData} from 'remix-typedjson';

import {PageSkeleton} from '~/components/page-skeleton.tsx';

import type {MembershipsLoaderData} from './_loader.server.ts';
import {TeamList} from './team-list.tsx';

export {loader} from './_loader.server.ts';

export default function MembersPage() {
  const {
    data: {memberships},
  } = useTypedLoaderData<MembershipsLoaderData>();

  return (
    <PageSkeleton
      header="Team members"
      description="Handle your team's members"
    >
      <div>
        <TeamList memberships={memberships} />
      </div>
    </PageSkeleton>
  );
}
