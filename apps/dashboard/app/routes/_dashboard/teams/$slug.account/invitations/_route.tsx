import {PageSkeleton} from '~/components/page-skeleton.tsx';

import {InvitationsList} from './invitation-list.tsx';

export {action} from './_action.server.ts';
export {loader} from './_loader.server.ts';

export default function InvitationsPage() {
  return (
    <PageSkeleton
      header="Invitations"
      description="Accept or decline team invitations"
    >
      <InvitationsList />
    </PageSkeleton>
  );
}
