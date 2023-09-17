import {Link} from '@remix-run/react';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@white-label/ui-core';

import {Membership, User} from '@/modules/domain/index.server';

export function AllTeams({
  currentUser,
}: {
  currentUser: {user: User.User; memberships: Array<Membership.Membership>};
}) {
  return (
    <div className="mx-auto grid max-w-lg grid-cols-1 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>All of your teams</CardTitle>
          <CardDescription>
            Navigate to a team to see more details
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {currentUser.memberships.map((membership) => (
            <div
              className="flex items-center justify-between space-x-4"
              key={membership.org.id}
            >
              <div className="flex items-center space-x-4">
                <div>
                  <Link
                    to={`/teams/${membership.org.id}`}
                    className="text-primary hover:text-primary-dark text-md font-medium leading-none transition-colors"
                  >
                    {membership.org.name}
                  </Link>
                </div>
              </div>

              <Badge variant="outline" className="ml-auto">
                {membership.role}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
