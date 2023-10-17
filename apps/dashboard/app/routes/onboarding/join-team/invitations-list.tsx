import {Link} from '@remix-run/react';
import {buttonVariants} from '@white-label/ui-core/button';
import {useTypedLoaderData} from 'remix-typedjson';

import {UserInvitationsLoaderData} from './_loader.server.ts';
import {JoinTeamForm} from './join-team-form.tsx';
import {NoInvitations} from './no-invitations.tsx';

export function InvitationsList() {
  const {
    data: {invitations},
  } = useTypedLoaderData<UserInvitationsLoaderData>();

  if (invitations.length === 0) {
    return (
      <div className="flex max-w-[1000px] justify-center">
        <NoInvitations />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {invitations.map((invitation) => (
        <JoinTeamForm invitation={invitation} key={invitation.id} />
      ))}
      <hr />
      <div className="text-center">
        <Link to="/onboarding" className={buttonVariants({variant: 'outline'})}>
          Back
        </Link>
      </div>
    </div>
  );
}
