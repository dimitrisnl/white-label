import {useTypedLoaderData} from 'remix-typedjson';

import {UserInvitationsLoaderData} from './_loader.server';
import {JoinTeamForm} from './join-team-form';
import {NoInvitations} from './no-invitations';

export function InvitationsList() {
  const {
    data: {invitations},
  } = useTypedLoaderData<UserInvitationsLoaderData>();

  if (invitations.length === 0) {
    return <NoInvitations />;
  }

  return (
    <div className="space-y-10">
      {invitations.map((invitation) => (
        <JoinTeamForm invitation={invitation} key={invitation.id} />
      ))}
    </div>
  );
}