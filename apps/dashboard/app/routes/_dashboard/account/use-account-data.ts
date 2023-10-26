import {useTypedRouteLoaderData} from 'remix-typedjson';

import type {AccountLoaderData} from './_loader.server.ts';

export function useAccountData() {
  const {data: currentUser} = useTypedRouteLoaderData<AccountLoaderData>(
    'routes/_dashboard/account/_layout'
  )!;

  return {currentUser};
}
