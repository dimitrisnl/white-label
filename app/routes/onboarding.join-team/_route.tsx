import {InvitationsList} from './invitations-list.tsx';

export {action} from './_action.server.ts';
export {loader} from './_loader.server.ts';

export default function JoinTeamPage() {
  return <InvitationsList />;
}
