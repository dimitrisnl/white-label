import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@white-label/ui-core';

import type {Membership} from '@/modules/domain/index.server';

function RoleBadge({role}: {role: string}) {
  return (
    <Badge variant={role === 'MEMBER' ? 'outline' : 'secondary'}>{role}</Badge>
  );
}

function UserTableEntry({membership}: {membership: Membership.Membership}) {
  return (
    <div className="flex items-center">
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">
          {membership.user.name}
        </p>
        <p className="text-muted-foreground text-sm">{membership.user.email}</p>
      </div>
      <div className="ml-auto font-medium">
        <RoleBadge role={membership.role} />
      </div>
    </div>
  );
}

export function TeamList({
  memberships,
}: {
  memberships: Array<Membership.Membership>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team members</CardTitle>
        <CardDescription>
          All the people that are part of this team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="space-y-4">
            {memberships
              .filter((membership) => membership.role === 'OWNER')
              .map((membership) => (
                <UserTableEntry
                  key={membership.user.id}
                  membership={membership}
                />
              ))}
          </div>
          <div className="space-y-4">
            {memberships
              .filter((membership) => membership.role === 'ADMIN')
              .map((membership) => (
                <UserTableEntry
                  key={membership.user.id}
                  membership={membership}
                />
              ))}
          </div>
          <div className="space-y-4">
            {memberships
              .filter((membership) => membership.role === 'MEMBER')
              .map((membership) => (
                <UserTableEntry
                  key={membership.user.id}
                  membership={membership}
                />
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
