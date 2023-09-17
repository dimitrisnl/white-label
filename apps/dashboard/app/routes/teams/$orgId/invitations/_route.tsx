import type {MetaFunction} from '@remix-run/node';

import {useOrgData} from '../use-org-data';
import {TeamInvitations} from './team-invitations';
import {Invitees} from './team-list';

export {action} from './_action.server';

export const meta: MetaFunction = () => {
  return [
    {title: 'Team Invitations'},
    {name: 'description', content: 'Team invitations page'},
  ];
};

export default function InvitationsPage() {
  const {invitations} = useOrgData();

  return (
    <div className="grid grid-cols-2 items-start gap-8">
      <TeamInvitations />
      <Invitees invitations={invitations} />
    </div>
  );
}
