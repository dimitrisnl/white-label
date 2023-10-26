import {GuestLayout} from '@/components/guest-layout.tsx';

import {InvitationsList} from './invitations-list.tsx';

export {loader} from './_loader.server.ts';
export {action} from './_action.server.ts';

export default function JoinTeamPage() {
  return (
    <GuestLayout>
      <InvitationsList />
    </GuestLayout>
  );
}
