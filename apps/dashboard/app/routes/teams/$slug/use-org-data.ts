import {useTypedRouteLoaderData} from 'remix-typedjson';

import type {BaseOrgLoader} from './_loader.server.ts';

export function useOrgData() {
  const {
    data: {org, currentUser},
  } = useTypedRouteLoaderData<BaseOrgLoader>('routes/teams/$slug/_layout')!;

  return {
    org,
    currentUser,
  };
}
