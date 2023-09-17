import {useOrgData} from '../use-org-data';
import {TeamList} from './team-list';

export default function MembersPage() {
  const {memberships} = useOrgData();

  return (
    <div className="grid grid-cols-2 items-start gap-8">
      <TeamList memberships={memberships} />
    </div>
  );
}
