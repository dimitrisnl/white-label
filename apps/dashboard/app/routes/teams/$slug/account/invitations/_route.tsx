import {InvitationsList} from './invitation-list';

export {action} from './_action.server';
export {loader} from './_loader.server';

export default function InvitationsPage() {
  return <InvitationsList />;
}
