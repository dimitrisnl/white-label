import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@white-label/ui-core';

import type {MembershipInvitation} from '@/modules/domain/index.server';

function RoleBadge({role}: {role: string}) {
  return (
    <Badge variant={role === 'MEMBER' ? 'outline' : 'secondary'}>{role}</Badge>
  );
}

function InvitationTableEntry({
  invitation,
}: {
  invitation: MembershipInvitation.MembershipInvitation;
}) {
  return (
    <div className="flex items-center">
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{invitation.email}</p>
        <p className="text-muted-foreground text-sm">{invitation.status}</p>
      </div>
      <div className="ml-auto font-medium">
        <RoleBadge role={invitation.role} />
      </div>
    </div>
  );
}

export function Invitees({
  invitations,
}: {
  invitations: Array<MembershipInvitation.MembershipInvitation>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitations</CardTitle>
        <CardDescription>
          All the pending invitations for this team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="space-y-4">
            {invitations
              .filter((invitation) => invitation.status === 'PENDING')
              .map((invitation) => (
                <InvitationTableEntry
                  key={invitation.id}
                  invitation={invitation}
                />
              ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
}
