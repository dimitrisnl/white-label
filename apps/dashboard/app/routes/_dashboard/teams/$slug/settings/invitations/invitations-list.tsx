import {Badge} from '@white-label/ui-core/badge';
import {Button} from '@white-label/ui-core/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@white-label/ui-core/card';
import {toast} from '@white-label/ui-core/toast';
import {useEffect} from 'react';
import {useTypedFetcher} from 'remix-typedjson';

import type {MembershipInvitation} from '~/modules/domain/index.server.ts';

import type {Action} from './_action.server.ts';

export function InvitationsList({
  invitations,
}: {
  invitations: Array<MembershipInvitation.MembershipInvitation>;
}) {
  const pendingInvitations = invitations.filter(
    (invitation) => invitation.status === 'PENDING'
  );
  const declinedInvitations = invitations.filter(
    (invitation) => invitation.status === 'DECLINED'
  );

  return (
    <div className="space-y-6">
      {pendingInvitations.length > 0 ? (
        <PendingInvitationsList invitations={pendingInvitations} />
      ) : null}
      {declinedInvitations.length > 0 ? (
        <DeclinedInvitationsList invitations={declinedInvitations} />
      ) : null}
    </div>
  );
}

function RoleBadge({role}: {role: string}) {
  return (
    <Badge
      variant={role === 'MEMBER' ? 'outline' : 'outline'}
      className="bg-white"
    >
      {role}
    </Badge>
  );
}

function InvitationTableEntry({
  invitation,
}: {
  invitation: MembershipInvitation.MembershipInvitation;
}) {
  const {Form, state, data} = useTypedFetcher<Action | undefined>();

  useEffect(() => {
    if (data?.ok === true) {
      toast.success('Invitation deleted');
    } else if (data?.ok === false) {
      const message = data.errors[0] ?? 'Huh';
      toast.error(message);
    }
  }, [data]);

  return (
    <Form className="flex items-center" method="DELETE">
      <div className="flex items-center">
        <div className="w-20">
          <RoleBadge role={invitation.role} />
        </div>
        <input type="hidden" name="invitationId" value={invitation.id} />
        <p className="pl-1 text-sm leading-none">{invitation.email}</p>
      </div>
      <div className="ml-auto flex items-center space-x-2">
        {invitation.status === 'DECLINED' ? (
          <Button
            variant="destructive"
            size="sm"
            name="intent"
            value="delete"
            disabled={state !== 'idle'}
          >
            Delete
          </Button>
        ) : null}
        {invitation.status === 'PENDING' ? (
          <>
            <Button
              variant="destructive"
              size="sm"
              name="intent"
              value="delete"
              disabled={state !== 'idle'}
            >
              Revoke
            </Button>
          </>
        ) : null}
      </div>
    </Form>
  );
}

function PendingInvitationsList({
  invitations,
}: {
  invitations: Array<MembershipInvitation.MembershipInvitation>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Invitations</CardTitle>
        <CardDescription>
          All the pending invitations for this team
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {invitations.map((invitation) => (
          <InvitationTableEntry key={invitation.id} invitation={invitation} />
        ))}
      </CardContent>
      <CardFooter className="text-xs">
        There are {invitations.length} invitation(s) pending
      </CardFooter>
    </Card>
  );
}

function DeclinedInvitationsList({
  invitations,
}: {
  invitations: Array<MembershipInvitation.MembershipInvitation>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Declined Invitations</CardTitle>
        <CardDescription>
          All the declined invitations for this team
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 bg-red-50/25">
        {invitations.map((invitation) => (
          <InvitationTableEntry key={invitation.id} invitation={invitation} />
        ))}
      </CardContent>
    </Card>
  );
}
