import type {getOrgRequest} from 'api-contract';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'ui-core';

type Users = getOrgRequest.ResponseData['users'];
type User = Users[number];

function RoleBadge({role}: {role: string}) {
  return (
    <Badge variant={role === 'MEMBER' ? 'outline' : 'secondary'}>{role}</Badge>
  );
}

function UserTableEntry({user}: {user: User}) {
  return (
    <div className="flex items-center">
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{user.name}</p>
        <p className="text-muted-foreground text-sm">{user.email}</p>
      </div>
      <div className="ml-auto font-medium">
        <RoleBadge role={user.membership.role} />
      </div>
    </div>
  );
}

export function TeamList({users}: {users: Users}) {
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
            {users
              .filter((user) => user.membership.role === 'OWNER')
              .map((user) => (
                <UserTableEntry key={user.id} user={user} />
              ))}
          </div>
          <div className="space-y-4">
            {users
              .filter((user) => user.membership.role === 'ADMIN')
              .map((user) => (
                <UserTableEntry key={user.id} user={user} />
              ))}
          </div>
          <div className="space-y-4">
            {users
              .filter((user) => user.membership.role === 'MEMBER')
              .map((user) => (
                <UserTableEntry key={user.id} user={user} />
              ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
}
