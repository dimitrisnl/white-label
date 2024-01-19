import {InvitationsList} from './invitation-list.tsx';

export {action} from './_action.server.ts';
export {loader} from './_loader.server.ts';

export default function InvitationsPage() {
  return <InvitationsList />;
}
