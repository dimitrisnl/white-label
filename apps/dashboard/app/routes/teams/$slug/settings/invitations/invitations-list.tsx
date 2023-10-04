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
import {useHydrated} from '@/utils/use-is-hydrated';

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
  isHydrated,
}: {
  invitation: MembershipInvitation.MembershipInvitation;
  isHydrated: boolean;
}) {
  return (
    <div className="flex items-center">
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{invitation.email}</p>

        {isHydrated && invitation.status === 'PENDING' ? (
          <p className="text-muted-foreground text-xs font-medium">
            {invitation.createdAt.toLocaleDateString()}
          </p>
        ) : null}
      </div>
      <div className="ml-auto font-medium">
        <RoleBadge role={invitation.role} />
      </div>
    </div>
  );
}

export function InvitationsList({
  invitations,
}: {
  invitations: Array<MembershipInvitation.MembershipInvitation>;
}) {
  const isHydrated = useHydrated();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitations</CardTitle>
        <CardDescription>
          All the pending invitations for this team
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-blue-50/25">
        <div className="space-y-3">
          <Badge variant="default">Pending</Badge>
          {invitations
            .filter((invitation) => invitation.status === 'PENDING')
            .map((invitation) => (
              <InvitationTableEntry
                key={invitation.id}
                invitation={invitation}
                isHydrated={isHydrated}
              />
            ))}
        </div>
      </CardContent>
      <CardFooter className="bg-red-50/25">
        <div className="space-y-3">
          <Badge variant="destructive">Declined</Badge>

          {invitations
            .filter((invitation) => invitation.status === 'DECLINED')
            .map((invitation) => (
              <InvitationTableEntry
                key={invitation.id}
                invitation={invitation}
                isHydrated={isHydrated}
              />
            ))}
        </div>
      </CardFooter>
    </Card>
  );
}
