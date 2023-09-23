import {useTypedLoaderData} from 'remix-typedjson';

import {MembershipsLoaderData} from './_loader.server';
import {TeamList} from './team-list';

export {loader} from './_loader.server';

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
