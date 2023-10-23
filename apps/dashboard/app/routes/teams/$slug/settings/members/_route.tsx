import {useTypedLoaderData} from 'remix-typedjson';

import type {MembershipsLoaderData} from './_loader.server.ts';
import {TeamList} from './team-list.tsx';

export {loader} from './_loader.server.ts';

export default function MembersPage() {
  const {
    data: {memberships},
  } = useTypedLoaderData<MembershipsLoaderData>();

  return (
    <div className="grid gap-8">
      <TeamList memberships={memberships} />
    </div>
  );
}
