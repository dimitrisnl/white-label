import {BaseLayout} from '@/components/layouts/base-layout';
import {useUser} from '@/lib/user';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'ui-core';
import {Link} from '@remix-run/react';

export function IndexPage() {
  const user = useUser();
  const orgs = user?.orgs ?? [];
  return (
    <BaseLayout title="All Teams">
      <div className="mx-auto grid max-w-lg grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>All of your teams</CardTitle>
            <CardDescription>
              Navigate to a team to see more details
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {orgs.map((org) => (
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <Link
                      to={`/teams/${org.id}`}
                      className="text-primary hover:text-primary-dark text-md font-medium leading-none transition-colors"
                    >
                      {org.name}
                    </Link>
                    <p className="text-muted-foreground text-sm">{org.slug}</p>
                  </div>
                </div>

                <Badge variant="outline" className="ml-auto">
                  {org.membership.role}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
}
