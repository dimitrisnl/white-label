import {useTypedRouteLoaderData} from 'remix-typedjson';

import {BaseOrgLoader} from './_loader.server';

export function useOrgData() {
  const {
    data: {currentUser, org, memberships, invitations},
  } = useTypedRouteLoaderData<BaseOrgLoader>('routes/teams/$orgId/_route')!;

  return {
    currentUser,
    org,
    memberships,
    invitations,
  };
}
