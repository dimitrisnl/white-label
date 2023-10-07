import {GuestLayout} from '@/components/guest-layout';

import {JoinMyTeam} from './join-team';

export {loader} from './_loader.server';
export {action} from './_action.server';

export default function JoinMyTeamPage() {
  return (
    <GuestLayout>
      <JoinMyTeam />
    </GuestLayout>
  );
}
