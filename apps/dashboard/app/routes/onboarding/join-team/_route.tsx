import {GuestLayout} from '@/components/guest-layout';

import {InvitationsList} from './invitations-list';

export {loader} from './_loader.server';
export {action} from './_action.server';

export default function JoinTeamPage() {
  return (
    <GuestLayout>
      <InvitationsList />
    </GuestLayout>
  );
}
