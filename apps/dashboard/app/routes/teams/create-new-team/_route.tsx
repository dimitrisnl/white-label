import {GuestLayout} from '@/components/guest-layout.tsx';

import {TeamInfo} from './team-info.tsx';

export {action} from './_action.server.ts';
export {loader} from './_loader.server.ts';

export default function CreateNewTeam() {
  return (
    <GuestLayout>
      <TeamInfo />
    </GuestLayout>
  );
}
