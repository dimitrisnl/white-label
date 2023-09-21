import {useTypedRouteLoaderData} from 'remix-typedjson';

import {BaseOrgLoader} from './_loader.server';

export function useOrgData() {
  const {
    data: {org, currentUser},
  } = useTypedRouteLoaderData<BaseOrgLoader>('routes/teams/$slug/_route')!;

  return {
    org,
    currentUser,
  };
}
