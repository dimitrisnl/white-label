import {useTypedRouteLoaderData} from 'remix-typedjson';

import type {BaseOrgLoader} from './_loader.server.ts';

export function useMetadata() {
  const {
    data: {org, memberships, user},
  } = useTypedRouteLoaderData<BaseOrgLoader>('routes/teams.$slug/_layout')!;

  return {
    org,
    memberships,
    user,
  };
}
