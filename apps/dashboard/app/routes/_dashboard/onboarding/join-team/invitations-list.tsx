import {Link} from '@remix-run/react';
import {buttonVariants} from '@white-label/ui-core/button';
import {useTypedLoaderData} from 'remix-typedjson';

import type {UserInvitationsLoaderData} from './_loader.server.ts';
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
    <div className="space-y-12">
      <div className="grid grid-cols-2 gap-8">
        {invitations.map((invitation) => (
          <JoinTeamForm invitation={invitation} key={invitation.id} />
        ))}
      </div>
      <hr />
      <div className="text-center">
        <Link to="/onboarding" className={buttonVariants({variant: 'outline'})}>
          Back
        </Link>
      </div>
    </div>
  );
}
