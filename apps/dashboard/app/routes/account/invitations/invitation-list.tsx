import {useTypedLoaderData} from 'remix-typedjson';

import type {UserInvitationsLoaderData} from './_loader.server.ts';
import {JoinTeamForm} from './join-team-form.tsx';
import {NoInvitations} from './no-invitations.tsx';

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
