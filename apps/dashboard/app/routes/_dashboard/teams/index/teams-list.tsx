import {ArrowRightCircleIcon} from '@heroicons/react/24/outline';
import {Link} from '@remix-run/react';
import {Card, CardHeader, CardTitle} from '@white-label/ui-core/card';

import {GuestLayout} from '~/components/guest-layout';
import type {Membership} from '~/modules/domain/index.server';

export function TeamsList({
  memberships,
}: {
  memberships: Array<Membership.Membership>;
}) {
  return (
    // todo this needs work/redesign
    <GuestLayout>
      <ul className="grid grid-cols-3 gap-6">
        {memberships.map((membership) => {
          return (
            <li key={membership.org.id}>
              <Link
                to={`/teams/${membership.org.slug}`}
                className="group block w-full"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between space-x-4">
                      <div className="group-hover:text-blue-600">
                        {membership.org.name}
                      </div>
                      <ArrowRightCircleIcon className="h-6 w-6 text-gray-500 group-hover:text-blue-600" />
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </GuestLayout>
  );
}
